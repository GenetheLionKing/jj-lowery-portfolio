import Link from "next/link";
import { navigation } from "@/data/profile";
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
        <div className="header-controls">
          <nav aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                prefetch={false}
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
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
