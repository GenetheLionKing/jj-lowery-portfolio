import Link from "next/link";
import Image from "next/image";
import { publicMedia, sizedPublicImage } from "@/content/media";
import type { CatalogItem } from "@/content/catalog";
export function PortfolioGrid({
  items,
  headingLevel = "h2",
}: {
  items: CatalogItem[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="work-grid">
      {items.map((item) => {
        const image =
          item.mainImage ?? (item.image ? publicMedia[item.image] : undefined);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            className="work-card"
          >
            {image && (
              <div className="work-image">
                <Image
                  unoptimized
                  src={sizedPublicImage(image.src, 640)}
                  alt={image.alt}
                  width={640}
                  height={480}
                  loading="lazy"
                />
              </div>
            )}
            <div className="work-caption">
              <Heading>{item.title}</Heading>
              <p>{item.summary}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
