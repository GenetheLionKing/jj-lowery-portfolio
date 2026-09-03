import Link from "next/link";
import { profile } from "@/data/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="wordmark" href="/">
          JJ LOWERY<span className="brand-period">.</span>
        </Link>
        <p>Clear thinking. Reliable systems.</p>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <span className="micro">Portfolio / v0.1</span>
      </div>
    </footer>
  );
}
