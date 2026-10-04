import Link from "next/link";
import Image from "next/image";
import type { PublishingCase } from "@/content/model";
import { publicMedia } from "@/content/media";

export function SelectedWorkGrid({
  headingLevel = "h3",
  cases,
}: {
  headingLevel?: "h2" | "h3";
  cases: PublishingCase[];
}) {
  const Heading = headingLevel;
  return (
    <div className="work-grid">
      {cases.map((work) => (
        <Link
          key={work.slug}
          className="work-card"
          href={`/work/${work.slug}/`}
          prefetch={false}
        >
          {work.thumbnail && (
            <div className="work-image">
              <Image
                unoptimized
                src={publicMedia[work.thumbnail].src}
                alt={publicMedia[work.thumbnail].alt}
                width="640"
                height="480"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="work-caption">
            <Heading>{work.cardTitle}</Heading>
            <p>{work.cardSubtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
