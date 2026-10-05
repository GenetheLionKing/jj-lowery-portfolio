import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons";
import { LearningArt } from "./index-hero";
import { publicMedia, sizedPublicImage } from "@/content/media";
import type { CatalogItem } from "@/content/catalog";
export function BlogFeature({
  item,
  preview,
}: {
  item: CatalogItem;
  preview: boolean;
}) {
  const media =
    item.mainImage ?? (item.image ? publicMedia[item.image] : undefined);
  return (
    <section className="index-hero blog-feature" aria-labelledby="blog-title">
      <div className="container index-hero-layout">
        <div className="index-hero-copy">
          <h1 id="blog-title" className="page-title">
            blog
          </h1>
          <p className="eyebrow feature-label">
            {preview ? "Featured preview" : "Latest post"}
            {!preview && item.publishedAt && (
              <>
                {" "}
                ·{" "}
                <time dateTime={item.publishedAt}>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(item.publishedAt))}
                </time>
              </>
            )}
          </p>
          <h2>
            <Link href={item.href} prefetch={false}>
              {item.title}
            </Link>
          </h2>
          <p className="feature-summary">{item.summary}</p>
          <Link
            href={item.href}
            prefetch={false}
            className="text-link page-link"
          >
            Read post <ArrowIcon />
          </Link>
        </div>
        <Link
          href={item.href}
          prefetch={false}
          className="index-hero-visual feature-image"
          aria-label={`Read ${item.title}`}
        >
          {media ? (
            <Image
              unoptimized
              src={sizedPublicImage(media.src, 960)}
              alt={media.alt}
              width={media.width}
              height={media.height}
              priority
            />
          ) : (
            <LearningArt />
          )}
        </Link>
      </div>
    </section>
  );
}
