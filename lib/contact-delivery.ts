import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  contactEmail,
  initialContactState,
  type ContactState,
  type ContactValues,
} from "./contact-form";

const emailAddress = z.email().max(254);

export async function deliverContactMessage(
  values: ContactValues,
  requestKey: string,
  env: Record<string, string | undefined> = process.env,
  request: typeof fetch = fetch,
) {
  const from = env.CONTACT_FROM_EMAIL;
  if (!env.RESEND_API_KEY || !emailAddress.safeParse(from).success) {
    throw new Error("Contact delivery configuration is incomplete.");
  }
  const body = {
    from: `JJ Lowery website <${from}>`,
    to: [contactEmail],
    reply_to: values.email.trim(),
    subject: "New message from jjlowery.com",
    text: `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`,
  };
  const digest = createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
  const response = await request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact/${requestKey}/${digest}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("The mail provider did not accept the message.");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("id" in result) ||
    typeof result.id !== "string" ||
    !result.id
  ) {
    throw new Error("The mail provider did not confirm acceptance.");
  }
}

export async function processContactSubmission(
  previous: ContactState,
  data: FormData,
  dependencies: {
    deliver: (values: ContactValues, requestKey: string) => Promise<void>;
    allow: () => boolean;
  },
): Promise<ContactState> {
  const field = (name: string) =>
    typeof data.get(name) === "string" ? String(data.get(name)) : "";
  const values = {
    name: field("name"),
    email: field("email"),
    message: field("message"),
  };
  const unchanged = JSON.stringify(values) === JSON.stringify(previous.values);
  const requestKey =
    unchanged && /^[a-f0-9-]{36}$/.test(previous.requestKey)
      ? previous.requestKey
      : randomUUID();
  const errors: ContactState["errors"] = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.length > 100 || /[\r\n]/.test(values.name))
    errors.name = "Use a name of 100 characters or fewer.";
  if (!emailAddress.safeParse(values.email.trim()).success)
    errors.email = "Enter a valid email address.";
  if (!values.message.trim()) errors.message = "Enter a message.";
  else if (values.message.length > 6000)
    errors.message = "Keep your message to 6,000 characters or fewer.";
  const failure = (notice: string): ContactState => ({
    status: "error",
    values,
    errors,
    notice,
    requestKey,
  });
  if (Object.keys(errors).length)
    return failure("Check the fields below and try again.");
  if (field("website"))
    return failure("Your message couldn’t be sent. Please try again.");
  if (!dependencies.allow())
    return failure("Too many attempts. Wait a few minutes and try again.");
  try {
    await dependencies.deliver(values, requestKey);
    return {
      ...initialContactState,
      status: "sent",
      notice: "Thanks — your message has been sent.",
    };
  } catch {
    return failure(
      "Your message couldn’t be sent. Your text is still here. Try again in a few minutes.",
    );
  }
}

// A bounded per-process guard; not a distributed rate limit across Vercel instances.
export class ContactThrottle {
  private attempts = new Map<string, { count: number; expires: number }>();
  allow(key: string, now = Date.now()) {
    for (const [id, value] of this.attempts)
      if (value.expires <= now) this.attempts.delete(id);
    const current = this.attempts.get(key);
    if (current) {
      if (current.count >= 5) return false;
      current.count++;
    } else {
      if (this.attempts.size >= 1000) return false;
      this.attempts.set(key, { count: 1, expires: now + 10 * 60 * 1000 });
    }
    return true;
  }
}
