import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link prefetch={false} href="/" aria-label="JJ Lowery — home">
          JJ Lowery<span className="brand-period">.</span>
        </Link>
        <p>Tucson, Arizona</p>
      </div>
    </footer>
  );
}
