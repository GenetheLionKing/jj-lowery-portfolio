/** Owner-approved public destination; no API credential or account access needed. */
export const gaMeasurementId = "G-YRGF46MB1T";
export const analyticsOrigin = "https://www.jjlowery.com";

const publicPages = {
  "/": "Home",
  "/about/": "About",
  "/about/story/": "About story",
  "/portfolio/": "Portfolio",
  "/learn/": "Learn",
  "/blog/": "Blog",
  "/contact/": "Contact",
  "/resume/": "Résumé",
  "/privacy/": "Privacy",
} as const;

export type AnalyticsPage = { path: string; title: string };
export function analyticsAllowed(production: boolean, hostname: string) {
  return production && ["jjlowery.com", "www.jjlowery.com"].includes(hostname);
}
const canonicalPath = (path: string) =>
  path === "/" ? path : `${path.replace(/\/$/, "")}/`;

export function appAnalyticsPage(
  pathname: string | null,
): AnalyticsPage | null {
  if (!pathname) return null;
  const path = canonicalPath(pathname);
  return Object.hasOwn(publicPages, path)
    ? { path, title: publicPages[path as keyof typeof publicPages] }
    : null;
}

/** Only server-validated published Post props may supply a dynamic route. */
export function postAnalyticsPage(
  kind: "blog" | "work",
  slug: unknown,
): AnalyticsPage | null {
  if (
    typeof slug !== "string" ||
    slug.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  )
    return null;
  return {
    path: `/${kind}/${slug}/`,
    title: kind === "blog" ? "Blog article" : "Portfolio article",
  };
}

export function pagesAnalyticsPage(
  route: string,
  props: Record<string, unknown>,
) {
  const key =
    route === "/blog/[slug]"
      ? "article"
      : route === "/work/[slug]"
        ? "study"
        : null;
  if (!key) return null;
  const post = props[key];
  return post && typeof post === "object" && "slug" in post
    ? postAnalyticsPage(key === "article" ? "blog" : "work", post.slug)
    : null;
}

export function pageMatchesLocation(page: AnalyticsPage, pathname: string) {
  return canonicalPath(pathname) === page.path;
}

/** Rebuild labels rather than accepting arbitrary titles, query strings or fragments. */
export function safeAnalyticsPage(
  page: AnalyticsPage | null,
): AnalyticsPage | null {
  if (!page) return null;
  const fixed = appAnalyticsPage(page.path);
  if (fixed) return fixed;
  const match = /^\/(blog|work)\/([a-z0-9-]+)\/$/.exec(page.path);
  return match
    ? postAnalyticsPage(match[1] as "blog" | "work", match[2])
    : null;
}

/** A recognized URL shape alone never proves a successful/published page. */
export function isPublicAnalyticsPath(pathname: string) {
  return (
    safeAnalyticsPage({ path: canonicalPath(pathname), title: "" }) !== null
  );
}
