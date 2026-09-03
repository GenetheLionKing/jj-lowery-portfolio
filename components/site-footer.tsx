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
        <a href={`mailto:${profile.email}`}>
          Let’s connect <span aria-hidden="true">↗</span>
        </a>
        <span className="micro">Portfolio / v0.1</span>
      </div>
    </footer>
  );
}
