import assert from "node:assert/strict";
import test from "node:test";
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
