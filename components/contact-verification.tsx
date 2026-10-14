"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    action: string;
    appearance: string;
    size: string;
    theme: string;
    "response-field": boolean;
    "refresh-expired": string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
    "timeout-callback": () => void;
    "unsupported-callback": () => void;
  }) => string;
  remove: (widget: string) => void;
};

declare global {
  interface Window { turnstile?: Turnstile }
}

let scriptReady: Promise<Turnstile> | undefined;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptReady) return scriptReady;
  scriptReady = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => {
      clearTimeout(timeout);
      script.onload = script.onerror = null;
      script.remove();
      scriptReady = undefined;
      reject(new Error("Verification unavailable"));
    };
    const timeout = setTimeout(fail, 10000);
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      if (!window.turnstile) return fail();
      clearTimeout(timeout);
      resolve(window.turnstile);
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return scriptReady;
}

export function ContactVerification({ siteKey }: { siteKey: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"loading" | "verified" | "error">("loading");

  useEffect(() => {
    if (!siteKey) return;
    let active = true;
    let widget: string | undefined;
    let api: Turnstile | undefined;
    const invalidate = (next: "loading" | "error") => {
      if (active) { setToken(""); setStatus(next); }
    };
    loadTurnstile().then((loaded) => {
      if (!active || !container.current) return;
      api = loaded;
      widget = api.render(container.current, {
        sitekey: siteKey,
        action: "contact",
        appearance: "interaction-only",
        size: "compact",
        theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
        "response-field": false,
        "refresh-expired": "auto",
        callback: (value) => {
          if (active) { setToken(value); setStatus("verified"); }
        },
        "expired-callback": () => invalidate("loading"),
        "error-callback": () => invalidate("error"),
        "timeout-callback": () => invalidate("error"),
        "unsupported-callback": () => invalidate("error"),
      });
    }).catch(() => invalidate("error"));
    return () => {
      active = false;
      if (widget !== undefined) api?.remove(widget);
    };
  }, [siteKey, attempt]);

  return (
    <div className="contact-verification">
      <input type="hidden" name="cf-turnstile-response" value={token} />
      <div ref={container} />
      <p role="status" aria-live="polite" aria-atomic="true">
        {!siteKey
          ? "Verification is unavailable. Please use a social link above to get in touch."
          : status === "verified"
            ? "Verification complete. You can send your message."
            : status === "error"
              ? "Verification couldn’t load or finish. Your text stays here. Retry, or use a social link above."
              : "Browser verification is required before sending."}
      </p>
      {siteKey && status === "error" && (
        <button type="button" className="contact-verification-retry" onClick={() => {
          setToken("");
          setStatus("loading");
          setAttempt((value) => value + 1);
        }}>Retry verification</button>
      )}
      <noscript>
        <p>Sending requires JavaScript for spam protection. Please use a social link above to get in touch.</p>
      </noscript>
      <p>Spam protection by Cloudflare Turnstile. <Link href="/privacy/">Privacy details</Link>.</p>
    </div>
  );
}
