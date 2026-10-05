import type { ReactNode } from "react";
/** One stacked title and introduction; optional real featured content follows. */
export function IndexHero({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <section className="index-hero" aria-labelledby={id}>
      <div className="container index-hero-layout">
        <h1 id={id} className="page-title">
          {title}
        </h1>
        <p className="index-hero-lead">{lead}</p>
        {children}
      </div>
    </section>
  );
}
