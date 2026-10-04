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
