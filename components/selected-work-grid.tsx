import Link from "next/link";
import Image from "next/image";
import { selectedWork } from "@/data/selected-work";

export function SelectedWorkGrid({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="work-grid">
      {selectedWork.map((work) => (
        <Link
          key={work.href}
          className="work-card"
          href={work.href}
          prefetch={false}
        >
          <div className="work-image">
            <Image
              unoptimized
              src={work.image}
              alt={work.alt}
              width="640"
              height="480"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="work-caption">
            <Heading>{work.title}</Heading>
            <p>{work.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
