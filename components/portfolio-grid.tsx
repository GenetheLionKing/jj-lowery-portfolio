import Link from "next/link";
import Image from "next/image";
import { publicMedia } from "@/content/media";
import { imageThumbnail, postThumbnailSizes } from "@/content/image-thumbnail";
import type { CatalogItem } from "@/content/catalog";
export function PortfolioGrid({
  items,
  headingLevel = "h2",
  imageFrame = "card",
}: {
  items: CatalogItem[];
  headingLevel?: "h2" | "h3";
  imageFrame?: "card" | "blog";
}) {
  const Heading = headingLevel;
  const imageSize = postThumbnailSizes[imageFrame];
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
              <div
                className={`work-image${imageFrame === "blog" ? " work-image--blog" : ""}`}
              >
                <Image
                  unoptimized
                  src={imageThumbnail(image, imageSize)}
                  alt={image.alt}
                  width={imageSize.width}
                  height={imageSize.height}
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
