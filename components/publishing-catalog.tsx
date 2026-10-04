import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";
import { publicMedia, topicLabel } from "@/content/media";
import type { CatalogItem } from "@/content/catalog";

export function CatalogGrid({
  items,
  headingLevel = "h2",
}: {
  items: CatalogItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="catalog-grid">
      {items.map((item) => (
        <article
          className={`catalog-card catalog-${item.kind}`}
          key={`${item.kind}:${item.slug}`}
        >
          <Link href={item.href} prefetch={false} className="catalog-card-link">
            {item.image && (
              <div className="catalog-image">
                <Image
                  unoptimized
                  src={publicMedia[item.image].src}
                  alt={publicMedia[item.image].alt}
                  width={640}
                  height={480}
                  loading="lazy"
                />
              </div>
            )}
            <div className="catalog-copy">
              <p className="eyebrow">
                {item.label}
                {item.kind === "resource" ? " · External" : ""}
              </p>
              <Heading>{item.title}</Heading>
              <p>{item.summary}</p>
              <span className="catalog-read">
                {item.kind === "resource" ? "Visit resource" : "Read"}
                <ArrowIcon
                  direction={item.kind === "resource" ? "up-right" : "right"}
                />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
export function TopicFilters({
  base,
  topics,
  selected = "",
  kind = "",
  kinds = false,
}: {
  base: string;
  topics: string[];
  selected?: string;
  kind?: string;
  kinds?: boolean;
}) {
  const href = (topic: string, format: string) => {
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    if (format) params.set("kind", format);
    return `${base}${params.size ? `?${params}` : ""}`;
  };
  return (
    <div className="catalog-filters">
      <nav aria-label="Filter by topic" className="filter-row">
        <Link
          prefetch={false}
          href={href("", kind)}
          aria-current={!selected ? "page" : undefined}
        >
          All topics
        </Link>
        {topics.map((topic) => (
          <Link
            prefetch={false}
            href={href(topic, kind)}
            key={topic}
            aria-current={selected === topic ? "page" : undefined}
          >
            {topicLabel(topic)}
          </Link>
        ))}
      </nav>
      {kinds && (
        <nav
          aria-label="Filter by content type"
          className="filter-row filter-formats"
        >
          {[
            ["", "Everything"],
            ["article", "Articles"],
            ["caseStudy", "Case studies"],
            ["resource", "Resources"],
          ].map(([value, title]) => (
            <Link
              prefetch={false}
              href={href(selected, value)}
              key={value}
              aria-current={kind === value ? "page" : undefined}
            >
              {title}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
export function PreviewWritingNote() {
  return (
    <p className="preview-note">
      Preview writing · These proposed articles are here for editorial review.
    </p>
  );
}
