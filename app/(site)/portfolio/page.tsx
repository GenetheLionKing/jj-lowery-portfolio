import type { Metadata } from "next";
import Image from "next/image";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { IndexHero } from "@/components/index-hero";
import { SystemsArt } from "@/components/about-art";
import { getPublicContent } from "@/content/public";
import { portfolioItems } from "@/content/catalog";
import { publicMedia, sizedPublicImage } from "@/content/media";
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected systems work on Vector and this site.",
};
export default async function PortfolioPage() {
  const { cases, articles } = await getPublicContent();
  const items = portfolioItems(cases, articles);
  const first = items.find((i) => i.mainImage || i.image);
  const image =
    first?.mainImage ?? (first?.image ? publicMedia[first.image] : undefined);
  return (
    <>
      <IndexHero
        id="portfolio-title"
        title="portfolio"
        lead="Selected systems work on Vector and this site."
      >
        {image ? (
          <div className="portfolio-monitor">
            <Image
              unoptimized
              src={sizedPublicImage(image.src, 960)}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
            />
            <span className="monitor-stand" aria-hidden="true" />
          </div>
        ) : (
          <SystemsArt />
        )}
      </IndexHero>
      <section
        className="portfolio-page index-content"
        aria-label="Selected work"
      >
        <div className="container">
          {items.length ? (
            <PortfolioGrid items={items} />
          ) : (
            <p className="catalog-empty">No published work yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
