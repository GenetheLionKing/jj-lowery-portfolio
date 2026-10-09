/** Only public acquisition labels belong in UTM links; never use visitor data. */
export type AnalyticsAcquisitionInput = { search: string; referrer: string };

const sensitiveLabel =
  /(?:^|[-_.])(email|e-mail|name|phone|mobile|contact|user|userid|uid|customer|client|session|auth|token|secret|password|passwd|key|code|jwt)(?:$|[-_.])/i;

const publicMedia = new Set([
  "social",
  "organic_social",
  "organic-social",
  "email",
  "referral",
  "organic",
  "organic_search",
  "organic-search",
  "cpc",
  "ppc",
  "paidsearch",
  "paid_search",
  "paid-search",
  "paid_social",
  "paid-social",
  "display",
  "banner",
  "affiliate",
  "video",
  "audio",
  "sms",
  "push",
  "qr",
  "print",
  "offline",
  "event",
  "podcast",
]);

function publicCampaignLabel(value: string | null) {
  if (
    !value ||
    value.length > 64 ||
    !/^[a-z][a-z0-9]*(?:[-_.][a-z0-9]+)*$/i.test(value) ||
    sensitiveLabel.test(value) ||
    value.split(/[-_.]/).some((part) => part.length > 16) ||
    /\d{5}/.test(value) ||
    (value.match(/\d/g)?.length ?? 0) > 6
  )
    return "";
  return value;
}

/** Keep the available referring origin; never forward its path or credentials. */
export function externalReferrerOrigin(value: string) {
  if (!value || value.length > 4096) return "";
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/\.$/, "");
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.port ||
      ["jjlowery.com", "www.jjlowery.com"].includes(hostname) ||
      /(?:^|\.)(localhost|local|localdomain|internal|intranet|lan|home|private|corp|test|invalid|example)$/.test(
        hostname,
      ) ||
      hostname === "home.arpa" ||
      hostname.endsWith(".home.arpa") ||
      !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(hostname)
    )
      return "";
    // URL.origin excludes username/password, path, query and fragment.
    url.hostname = hostname;
    return url.origin;
  } catch {
    return "";
  }
}

export function analyticsAcquisition(input?: AnalyticsAcquisitionInput) {
  const result = {
    referrer: externalReferrerOrigin(input?.referrer ?? ""),
    campaign_source: "",
    campaign_medium: "",
    campaign_name: "",
    // Never copy search terms, content IDs, campaign IDs or advertising click IDs.
    campaign_id: "",
    campaign_term: "",
    campaign_content: "",
  };
  const search = input?.search ?? "";
  if (!search || search.length > 2048) return result;
  const parameters = new URLSearchParams(search);
  const labels = ["utm_source", "utm_medium", "utm_campaign"].map((key) => {
    const values = parameters.getAll(key);
    if (values.length !== 1) return "";
    const value = values[0];
    // A finite channel list is safer than arbitrary medium labels; email is valid.
    if (key === "utm_medium")
      return publicMedia.has(value.toLowerCase()) ? value : "";
    if (key === "utm_source" && value.toLowerCase() === "email") return value;
    return publicCampaignLabel(value);
  });
  // A complete valid triple avoids partial or conflicting campaign attribution.
  if (labels.every(Boolean) && publicMedia.has(labels[1].toLowerCase())) {
    [result.campaign_source, result.campaign_medium, result.campaign_name] =
      labels;
  }
  return result;
}
