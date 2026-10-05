/** One compact title and short introduction; the work below provides the imagery. */
export function IndexHero({
  id,
  title,
  lead,
}: {
  id: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="index-hero" aria-labelledby={id}>
      <div className="container index-hero-layout">
        <h1 id={id} className="page-title">
          {title}
        </h1>
        <p className="index-hero-lead">{lead}</p>
      </div>
    </section>
  );
}
