import { PortableText } from "@portabletext/react";
import type { RichText } from "@/content/model";
import Image from "next/image";
import { sizedPublicImage } from "@/content/media";
import { SystemDiagram } from "./diagrams";
export function ArticleBody({ body }: { body: RichText }) {
  return (
    <PortableText
      value={body}
      components={{
        types: {
          image: ({ value }) => (
            <figure className="reading-image">
              <Image
                unoptimized
                src={sizedPublicImage(value.src, 960)}
                width={value.width}
                height={value.height}
                alt={value.alt}
                loading="lazy"
                sizes="(max-width: 720px) calc(100vw - 40px), 680px"
              />
              {value.caption && <figcaption>{value.caption}</figcaption>}
            </figure>
          ),
          systemDiagram: ({ value }) => (
            <div className="reading-diagram">
              <SystemDiagram kind={value.kind} />
            </div>
          ),
        },
        marks: {
          link: ({ value, children }) => <a href={value?.href}>{children}</a>,
        },
      }}
    />
  );
}
