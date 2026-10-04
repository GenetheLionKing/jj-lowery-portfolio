import Link from "next/link";
import { SiteNavigation, SocialLinks } from "@/components/site-navigation";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link
          prefetch={false}
          className="footer-brand"
          href="/"
          aria-label="JJ Lowery — home"
        >
          JJ Lowery<span className="brand-period">.</span>
        </Link>
        <SiteNavigation label="Footer navigation" />
        <Link prefetch={false} className="footer-writing" href="/blog/">
          Writing
        </Link>
        <SocialLinks label="Footer social profiles" />
      </div>
    </footer>
  );
}
