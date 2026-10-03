import Link from "next/link";
import { SiteNavigation, SocialLinks } from "@/components/site-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          prefetch={false}
          className="wordmark"
          href="/"
          aria-label="JJ Lowery — home"
        >
          JJ Lowery<span className="brand-period">.</span>
        </Link>
        <SiteNavigation label="Main navigation" />
        <div className="header-social">
          <SocialLinks label="Social profiles" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
