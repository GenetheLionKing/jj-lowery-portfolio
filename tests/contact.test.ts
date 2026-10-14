import assert from "node:assert/strict";
import test from "node:test";
import { verifyContactToken } from "../lib/contact-turnstile";
import {
  ContactThrottle,
  deliverContactMessage,
  processContactSubmission,
} from "../lib/contact-delivery";
import {
  contactEmail,
  initialContactState,
  type ContactValues,
} from "../lib/contact-form";

const values: ContactValues = {
  name: "Casey Visitor",
  email: "casey@example.com",
  message: "Hello JJ,\nI’d like to talk about a project.",
};
const environment = {
  RESEND_API_KEY: "test-key-not-a-credential",
  CONTACT_FROM_EMAIL: "contact@example.com",
};
function form(overrides: Partial<ContactValues & { website: string }> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ ...values, ...overrides }))
    data.set(key, value);
  return data;
}

test("invalid, blank, oversized and header-injection input never reaches delivery", async () => {
  for (const input of [
    { name: " ", email: "broken", message: " " },
    {
      name: "n".repeat(101),
      email: "visitor@example.com\r\nBcc: other@example.com",
      message: "m".repeat(6001),
    },
  ]) {
    const state = await processContactSubmission(
      initialContactState,
      form(input),
      {
        deliver: async () => assert.fail("must not send"),
        verify: async () => true,
    allow: () => assert.fail("must not consume throttle"),
      },
    );
    assert.equal(state.status, "error");
    assert.deepEqual(Object.keys(state.errors).sort(), [
      "email",
      "message",
      "name",
    ]);
    assert.deepEqual(state.values, { ...values, ...input });
  }
});

test("honeypot and throttle reject without sending or false success", async () => {
  for (const data of [form({ website: "spam" }), form()]) {
    const state = await processContactSubmission(initialContactState, data, {
      deliver: async () => assert.fail("must not send"),
      verify: async () => true,
    allow: () => false,
    });
    assert.equal(state.status, "error");
    assert.deepEqual(state.values, values);
  }
});

test("delivery failure preserves exact text and unchanged retries reuse the request key", async () => {
  const dependencies = {
    deliver: async () => {
      throw Error("unavailable");
    },
    verify: async () => true,
    allow: () => true,
  };
  const first = await processContactSubmission(
    initialContactState,
    form(),
    dependencies,
  );
  const retry = await processContactSubmission(first, form(), dependencies);
  const edited = await processContactSubmission(
    retry,
    form({ message: "Changed message" }),
    dependencies,
  );
  assert.equal(first.status, "error");
  assert.deepEqual(first.values, values);
  assert.match(first.notice, /text is still here/);
  assert.equal(first.requestKey, retry.requestKey);
  assert.notEqual(retry.requestKey, edited.requestKey);
});

test("success waits for confirmed provider acceptance then clears the form", async () => {
  let accept!: () => void;
  const accepted = new Promise<void>((resolve) => {
    accept = resolve;
  });
  const submission = processContactSubmission(initialContactState, form(), {
    deliver: () => accepted,
    verify: async () => true,
    allow: () => true,
  });
  assert.equal(
    await Promise.race([
      submission.then(() => "done"),
      Promise.resolve("pending"),
    ]),
    "pending",
  );
  accept();
  const state = await submission;
  assert.equal(state.status, "sent");
  assert.deepEqual(state.values, initialContactState.values);
});

test("Resend request fixes recipient, uses approved sender/reply-to, sends plain text and a stable idempotency key", async () => {
  const requests: RequestInit[] = [];
  const request: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    requests.push(init!);
    return Response.json({ id: "mock-provider-acceptance" });
  };
  await deliverContactMessage(values, "test-request", environment, request);
  await deliverContactMessage(values, "test-request", environment, request);
  const body = JSON.parse(String(requests[0].body));
  assert.deepEqual(body.to, [contactEmail]);
  assert.equal(body.from, "JJ Lowery website <contact@example.com>");
  assert.equal(body.reply_to, values.email);
  assert.equal(body.subject, "New message from jjlowery.com");
  assert.match(body.text, /Casey Visitor/);
  assert.match(body.text, /I’d like to talk about a project/);
  assert.equal(body.html, undefined);
  assert.equal(
    new Headers(requests[0].headers).get("Idempotency-Key"),
    new Headers(requests[1].headers).get("Idempotency-Key"),
  );
  assert.ok(requests[0].signal);
});

test("missing key or invalid sender fails before a network request", async () => {
  for (const env of [
    {},
    {
      RESEND_API_KEY: "test",
      CONTACT_FROM_EMAIL: "bad\r\nBcc: attacker@example.com",
    },
  ]) {
    await assert.rejects(
      deliverContactMessage(values, "test", env, async () => {
        assert.fail("must not request");
      }),
    );
  }
});

test("Vercel Preview cannot send with configured mail credentials; Production keeps delivery behavior", async () => {
  let requests = 0;
  const request: typeof fetch = async () => {
    requests++;
    return Response.json({ id: "mock-provider-acceptance" });
  };
  const state = await processContactSubmission(initialContactState, form(), {
    allow: () => true,
    verify: async () => true,
    deliver: (input, key) => deliverContactMessage(
      input, key, { ...environment, VERCEL_ENV: "preview" }, request,
    ),
  });
  assert.equal(requests, 0);
  assert.equal(state.status, "error");
  assert.deepEqual(state.values, values);
  assert.match(state.notice, /text is still here/);
  await deliverContactMessage(values, "test", { ...environment, VERCEL_ENV: "production" }, request);
  assert.equal(requests, 1);
});

test("Resend errors, malformed acceptance, network failures and timeouts never return success", async () => {
  for (const request of [
    async () => Response.json({ message: "rejected" }, { status: 403 }),
    async () => Response.json({}),
    async () => Response.json({ id: "" }),
    async () => new Response("invalid-json"),
    async () => {
      throw new Error("network failure");
    },
    async () => {
      throw new DOMException("timeout", "TimeoutError");
    },
  ]) {
    const state = await processContactSubmission(initialContactState, form(), {
      deliver: (input, key) =>
        deliverContactMessage(input, key, environment, request),
      verify: async () => true,
    allow: () => true,
    });
    assert.equal(state.status, "error");
    assert.deepEqual(state.values, values);
  }
});

test("throttle allows five attempts per key and recovers after ten minutes", () => {
  const throttle = new ContactThrottle();
  for (let i = 0; i < 5; i++) assert.equal(throttle.allow("visitor", 0), true);
  assert.equal(throttle.allow("visitor", 0), false);
  assert.equal(throttle.allow("other", 0), true);
  assert.equal(throttle.allow("visitor", 600000), true);
});

const turnstileEnvironment = {
  TURNSTILE_SECRET_KEY: "mock-secret-not-a-credential",
  TURNSTILE_ALLOWED_HOSTNAMES: "jjlowery.com,www.jjlowery.com",
};
const verified = { success: true, hostname: "www.jjlowery.com", action: "contact" };

test("Turnstile checks only the token with the server secret, requires exact hostname/action and does not cache", async () => {
  let calls = 0;
  const request: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(init?.method, "POST");
    assert.equal(init?.cache, "no-store");
    assert.ok(init?.signal);
    assert.deepEqual(JSON.parse(String(init?.body)), {
      secret: turnstileEnvironment.TURNSTILE_SECRET_KEY,
      response: "mock-token",
    });
    return Response.json(calls === 1 ? verified : {
      success: false, "error-codes": ["timeout-or-duplicate"],
    });
  };
  assert.equal(await verifyContactToken("mock-token", turnstileEnvironment, request), true);
  assert.equal(await verifyContactToken("mock-token", turnstileEnvironment, request), false);
  assert.equal(calls, 2);
});

test("missing/invalid configuration and missing/oversized tokens fail before any network call", async () => {
  let calls = 0;
  const request: typeof fetch = async () => {
    calls++;
    return Response.json(verified);
  };
  for (const env of [
    {},
    { TURNSTILE_SECRET_KEY: "mock" },
    { ...turnstileEnvironment, TURNSTILE_ALLOWED_HOSTNAMES: " " },
    { ...turnstileEnvironment, TURNSTILE_ALLOWED_HOSTNAMES: "*.jjlowery.com" },
    { ...turnstileEnvironment, TURNSTILE_ALLOWED_HOSTNAMES: "https://jjlowery.com" },
  ]) assert.equal(await verifyContactToken("mock-token", env, request), false);
  for (const token of ["", " ", "x".repeat(2049)])
    assert.equal(await verifyContactToken(token, turnstileEnvironment, request), false);
  assert.equal(calls, 0);
});

// Literal fixtures from https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const publicTurnstileTestSecrets = [
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
];

for (const secret of publicTurnstileTestSecrets) {
  for (const deployment of [
    { NODE_ENV: "production" },
    { NODE_ENV: "test", VERCEL_ENV: "production" },
    { NODE_ENV: "test", VERCEL_ENV: "preview" },
    { NODE_ENV: "development", VERCEL_ENV: "development" },
  ]) {
    test(`public Turnstile secret ${secret[0]} is blocked before requests in ${JSON.stringify(deployment)}`, async () => {
      let calls = 0;
      const request: typeof fetch = async () => {
        calls++;
        return Response.json(verified);
      };
      for (const configuredSecret of [secret, ` \n${secret}\t `]) {
        const accepted = await verifyContactToken("XXXX.DUMMY.TOKEN.XXXX", {
          ...turnstileEnvironment,
          ...deployment,
          TURNSTILE_SECRET_KEY: configuredSecret,
        }, request);
        // Assert outside the callback: the verifier deliberately catches request errors.
        assert.equal(calls, 0);
        assert.equal(accepted, false);
      }
    });
  }
}

test("public test secrets remain usable locally and non-test secrets still verify in Production", async () => {
  const configurations = [
    ...publicTurnstileTestSecrets.map((secret) => ({
      ...turnstileEnvironment,
      NODE_ENV: "development",
      TURNSTILE_SECRET_KEY: secret,
    })),
    { ...turnstileEnvironment, NODE_ENV: "production", VERCEL_ENV: "production" },
  ];
  for (const env of configurations) {
    let calls = 0;
    const request: typeof fetch = async () => {
      calls++;
      return Response.json(verified);
    };
    const accepted = await verifyContactToken("mock-token", env, request);
    assert.equal(calls, 1);
    assert.equal(accepted, true);
  }
});

test("all verification failures preserve text and prevent delivery, including expired/replayed tokens and outages", async () => {
  const requests: (typeof fetch)[] = [
    ...[
      { success: false, "error-codes": ["invalid-input-response"] },
      { success: false, "error-codes": ["timeout-or-duplicate"] },
      { ...verified, hostname: "attacker.example" },
      { ...verified, hostname: "www.jjlowery.com.attacker.example" },
      { ...verified, action: "login" },
      { ...verified, success: "true" },
      { success: true }, null, [], {},
    ].map((body) => async () => Response.json(body)),
    async () => Response.json(verified, { status: 500 }),
    async () => new Response("broken-json"),
    async () => { throw Error("offline"); },
    async () => { throw new DOMException("timeout", "TimeoutError"); },
  ];
  for (const request of requests) {
    const data = form();
    data.set("cf-turnstile-response", "mock-token");
    const state = await processContactSubmission(initialContactState, data, {
      allow: () => true,
      verify: (token) => verifyContactToken(token, turnstileEnvironment, request),
      deliver: async () => assert.fail("must not send"),
    });
    assert.equal(state.status, "error");
    assert.deepEqual(state.values, values);
    assert.match(state.notice, /Verification couldn’t be completed/);
    assert.notEqual(state.verificationKey, initialContactState.verificationKey);
    assert.ok(!JSON.stringify(state).includes("mock-token"));
  }
  const state = await processContactSubmission(initialContactState, form(), {
    allow: () => true,
    verify: async () => { throw Error("unexpected verifier failure"); },
    deliver: async () => assert.fail("must not send"),
  });
  assert.equal(state.status, "error");
});

test("verification must finish before delivery; mail retries use new verification but the same mail idempotency key", async () => {
  let confirm!: (value: boolean) => void;
  const events: string[] = [];
  const data = form();
  data.set("cf-turnstile-response", "first-token");
  const firstPending = processContactSubmission(initialContactState, data, {
    allow: () => true,
    verify: async (token) => {
      events.push(token);
      return new Promise<boolean>((resolve) => { confirm = resolve; });
    },
    deliver: async () => { events.push("delivery"); throw Error("mail outage"); },
  });
  assert.deepEqual(events, ["first-token"]);
  confirm(true);
  const first = await firstPending;
  assert.deepEqual(events, ["first-token", "delivery"]);
  data.set("cf-turnstile-response", "fresh-token");
  const retry = await processContactSubmission(first, data, {
    allow: () => true,
    verify: async (token) => { assert.equal(token, "fresh-token"); return true; },
    deliver: async (_, key) => { assert.equal(key, first.requestKey); throw Error("mail outage"); },
  });
  assert.notEqual(first.verificationKey, retry.verificationKey);
  assert.equal(first.requestKey, retry.requestKey);
  assert.deepEqual(retry.values, values);
});

test("validation, honeypot and throttle short-circuit verification and mail delivery", async () => {
  for (const data of [form({ name: "" }), form({ website: "bot" }), form()]) {
    const state = await processContactSubmission(initialContactState, data, {
      allow: () => false,
      verify: async () => assert.fail("must not verify"),
      deliver: async () => assert.fail("must not send"),
    });
    assert.equal(state.status, "error");
  }
});
