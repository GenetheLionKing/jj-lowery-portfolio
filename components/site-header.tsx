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
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={item.label === "Résumé" ? "nav-resume" : undefined}
            >
              {item.label}
              {item.label === "Résumé" && <span aria-hidden="true"> ↗</span>}
              {item.external && (
                <span className="sr-only"> (opens in a new tab)</span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
