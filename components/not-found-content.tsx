import { ArrowIcon } from "./icons";
import Link from "next/link";
export function NotFoundContent() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 / Page not found</p>
      <h1>This path doesn’t lead to a page.</h1>
      <p>Let’s get you back to the portfolio.</p>
      <Link className="button button-dark" href="/portfolio/" prefetch={false}>
        Explore selected work <ArrowIcon />
      </Link>
    </section>
  );
}
