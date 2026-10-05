import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";
import { publicMedia, sizedPublicImage } from "@/content/media";
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
            {(item.mainImage || item.image) && (
              <div className="catalog-image">
                <Image
                  unoptimized
                  src={sizedPublicImage(
                    item.mainImage?.src ?? publicMedia[item.image!].src,
                    640,
                  )}
                  alt={item.mainImage?.alt ?? publicMedia[item.image!].alt}
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
export function PreviewWritingNote() {
  return (
    <p className="preview-note">
      Preview writing · These proposed articles are here for editorial review.
    </p>
  );
}
