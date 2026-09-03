import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 / Page not found</p>
      <h1>This path doesn’t lead to a page.</h1>
      <p>The work is still here. Let’s get you back to it.</p>
      <Link className="button button-dark" href="/#work">
        Explore selected work <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
