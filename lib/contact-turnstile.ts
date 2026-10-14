// Called only by the contact Server Action. Never import into a client component.
export async function verifyContactToken(
  token: string,
  env: Record<string, string | undefined> = process.env,
  request: typeof fetch = fetch,
): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  const hostnames = (env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  // Public testing secrets must never authorize delivery in a deployed build.
  const testSecret = /^[123]x0{29}AA$/.test(secret ?? "");
  if (
    !secret ||
    (testSecret && (env.NODE_ENV === "production" || !!env.VERCEL_ENV)) ||
    !hostnames.length ||
    hostnames.some((hostname) => !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(hostname)) ||
    !token.trim() ||
    token.length > 2048
  ) return false;

  try {
    const response = await request(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      },
    );
    if (!response.ok) return false;
    const result: unknown = await response.json();
    // Siteverify enforces expiry and single use; never cache an accepted token.
    return !!result && typeof result === "object" &&
      "success" in result && result.success === true &&
      "action" in result && result.action === "contact" &&
      "hostname" in result && typeof result.hostname === "string" &&
      hostnames.includes(result.hostname);
  } catch {
    return false;
  }
}
