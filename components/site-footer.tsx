import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="wordmark" href="/">
          JJ LOWERY<span className="brand-period">.</span>
        </Link>
        <p>Clear thinking. Reliable systems.</p>
        <span className="micro">Portfolio / v0.1</span>
      </div>
    </footer>
  );
}
