import Link from "next/link";
import { navigation } from "@/data/profile";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="JJ Lowery — home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          JJ LOWERY<span className="brand-period">.</span>
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map((item) =>
            item.label === "Résumé" ? (
              <span className="nav-actions" key={item.label}>
                <ThemeToggle />
                <Link href={item.href} className="nav-resume">
                  {item.label}<span aria-hidden="true"> ↗</span>
                </Link>
              </span>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
                {item.external && (
                  <span className="sr-only"> (opens in a new tab)</span>
                )}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
