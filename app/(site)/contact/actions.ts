"use server";

import { headers } from "next/headers";
import {
  ContactThrottle,
  deliverContactMessage,
  processContactSubmission,
} from "@/lib/contact-delivery";
import type { ContactState } from "@/lib/contact-form";

const throttle = new ContactThrottle();

export async function sendContactMessage(
  previous: ContactState,
  data: FormData,
): Promise<ContactState> {
  const requestHeaders = await headers();
  const address =
    requestHeaders.get("x-vercel-forwarded-for") ||
    requestHeaders.get("x-forwarded-for") ||
    "unknown";
  return processContactSubmission(previous, data, {
    deliver: deliverContactMessage,
    allow: () => throttle.allow(address.split(",")[0].trim()),
  });
}
