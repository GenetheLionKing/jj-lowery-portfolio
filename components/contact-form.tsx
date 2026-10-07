"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/app/(site)/contact/actions";
import { contactEmail, initialContactState } from "@/lib/contact-form";

export function ContactForm() {
  const [state, action, pending] = useActionState(
    sendContactMessage,
    initialContactState,
    "/contact/",
  );
  const noticeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status !== "idle") noticeRef.current?.focus();
  }, [state]);

  return (
    <form
      action={action}
      className="contact-form"
      aria-labelledby="contact-email-title"
      aria-busy={pending}
    >
      <p className="contact-form-note">All fields are required.</p>
      <p
        ref={noticeRef}
        className="contact-notice"
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {pending ? "Sending your message…" : state.notice}
      </p>
      <div className="contact-form-fields">
        <div className="contact-details-fields">
          <div className="contact-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              defaultValue={state.values.name}
              readOnly={pending}
              aria-invalid={!!state.errors.name}
              aria-describedby={
                state.errors.name ? "contact-name-error" : undefined
              }
            />
            {state.errors.name && (
              <p id="contact-name-error" className="contact-field-error">
                {state.errors.name}
              </p>
            )}
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              defaultValue={state.values.email}
              readOnly={pending}
              aria-invalid={!!state.errors.email}
              aria-describedby={
                state.errors.email ? "contact-email-error" : undefined
              }
            />
            {state.errors.email && (
              <p id="contact-email-error" className="contact-field-error">
                {state.errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="contact-field contact-message-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            maxLength={6000}
            defaultValue={state.values.message}
            readOnly={pending}
            aria-invalid={!!state.errors.message}
            aria-describedby={
              state.errors.message ? "contact-message-error" : undefined
            }
          />
          {state.errors.message && (
            <p id="contact-message-error" className="contact-field-error">
              {state.errors.message}
            </p>
          )}
        </div>
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="contact-form-actions">
        <button type="submit" className="button button-dark" disabled={pending}>
          {pending ? "Sending…" : "Send email"}
        </button>
        <p>
          Prefer your own email app?{" "}
          <a href={`mailto:${contactEmail}`}>Email me directly</a>.
        </p>
      </div>
    </form>
  );
}
