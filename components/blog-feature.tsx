import Link from "next/link";
import Image from "next/image";
import type { CatalogItem } from "@/content/catalog";
import { contentHref } from "@/content/catalog";
import { publicMedia } from "@/content/media";
import { imageThumbnail, postThumbnailSizes } from "@/content/image-thumbnail";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Only the first explicitly Blog-placed published Post is passed by the page. */
export function BlogFeature({ item }: { item: CatalogItem }) {
  const image =
    item.mainImage ?? (item.image ? publicMedia[item.image] : undefined);
  const date = item.updatedAt ?? item.publishedAt;
  const ownArticle = item.href === contentHref(item.kind, item.slug);
  return (
    <article className="blog-feature" aria-label="Featured post">
      {image && (
        <Link
          href={item.href}
          prefetch={false}
          aria-label={`Read ${item.title}`}
          className="blog-feature-image"
        >
          <Image
            unoptimized
            src={imageThumbnail(image, postThumbnailSizes.featured)}
            alt={image.alt}
            width={postThumbnailSizes.featured.width}
            height={postThumbnailSizes.featured.height}
            priority
            sizes="(max-width: 720px) calc(100vw - 40px), 680px"
          />
        </Link>
      )}
      <div className="blog-feature-copy">
        <p className="eyebrow">Featured post</p>
        <h2>
          <Link href={item.href} prefetch={false}>
            {item.title}
          </Link>
        </h2>
        <p className="blog-feature-summary">{item.summary}</p>
        {ownArticle && (
          <div className="blog-feature-author">
            <Image
              unoptimized
              src="/images/profile-shoulder-320.webp"
              width={40}
              height={40}
              alt=""
            />
            <div>
              <span>JJ Lowery</span>
              {date && (
                <p>
                  {item.updatedAt && item.updatedAt !== item.publishedAt
                    ? "Updated"
                    : "Published"}{" "}
                  <time dateTime={date}>
                    {dateFormat.format(new Date(date))}
                  </time>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
