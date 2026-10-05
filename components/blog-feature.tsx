import Link from "next/link";
import Image from "next/image";
import type { CatalogItem } from "@/content/catalog";
import { publicMedia, sizedPublicImage } from "@/content/media";

/** Only the first explicitly Blog-placed published Post is passed by the page. */
export function BlogFeature({ item }: { item: CatalogItem }) {
  const image =
    item.mainImage ?? (item.image ? publicMedia[item.image] : undefined);
  return (
    <div className="blog-feature">
      <div className="blog-feature-copy">
        <p className="eyebrow">Featured post</p>
        <h2>
          <Link href={item.href} prefetch={false}>
            {item.title}
          </Link>
        </h2>
        <p>{item.summary}</p>
      </div>
      {image && (
        <Link
          href={item.href}
          prefetch={false}
          aria-label={`Read ${item.title}`}
          className="blog-feature-image"
        >
          <Image
            unoptimized
            src={sizedPublicImage(image.src, 960)}
            alt={image.alt}
            width={image.width}
            height={image.height}
          />
        </Link>
      )}
    </div>
  );
}
