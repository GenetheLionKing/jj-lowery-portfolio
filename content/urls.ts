/** No executable schemes, protocol-relative targets or URL credentials. */
export function isSafeLink(value: string): boolean {
  if (/[\u0000-\u0020\\]/.test(value)) return false;
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
  ) {
    return !/[\u0000-\u0020]/.test(value);
  }
  if (/^#[a-z0-9-]+$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isPublicImageAssetRef(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = /^image-[a-zA-Z0-9]+-([0-9]+)x([0-9]+)-(jpg|png|webp)$/.exec(
    value,
  );
  return (
    !!match &&
    Number(match[1]) > 0 &&
    Number(match[2]) > 0 &&
    Number(match[1]) <= 20000 &&
    Number(match[2]) <= 20000
  );
}
