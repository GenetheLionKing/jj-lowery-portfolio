import Image from "next/image";
import { Fragment } from "react";
import { ArticleBody } from "./article-body";
import { sizedPublicImage } from "@/content/media";
import type { AboutSection, RichText } from "@/content/model";

function Copy({ headline, body }: { headline: string; body: RichText }) {
  return (
    <div className="about-section-copy">
      <h2>{headline}</h2>
      <div className="reading-body about-section-body">
        <ArticleBody body={body} />
      </div>
    </div>
  );
}

function Media({
  image,
  caption,
}: {
  image: AboutSection["image"];
  caption?: string | null;
}) {
  return (
    <figure className="about-section-media">
      <Image
        unoptimized
        src={sizedPublicImage(image.src, 1080)}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading="lazy"
        sizes="(max-width: 800px) calc(100vw - 40px), 1080px"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

type SectionRenderers = {
  [Type in AboutSection["_type"]]: (props: {
    section: Extract<AboutSection, { _type: Type }>;
  }) => React.ReactNode;
};

// Extensions register a schema and typed renderer here, never executable CMS code.
const sectionRenderers = {
  aboutImageLeft: ({ section }) => (
    <>
      <Media image={section.image} />
      <Copy headline={section.headline} body={section.body} />
    </>
  ),
  aboutCopyImageCopy: ({ section }) => (
    <>
      <Copy headline={section.leftHeadline} body={section.leftBody} />
      <Media image={section.image} />
      <Copy headline={section.rightHeadline} body={section.rightBody} />
    </>
  ),
  aboutImageRight: ({ section }) => (
    <>
      <Copy headline={section.headline} body={section.body} />
      <Media image={section.image} />
    </>
  ),
  aboutImageOnly: ({ section }) => (
    <Media image={section.image} caption={section.caption} />
  ),
} satisfies SectionRenderers;

function SectionContent({ section }: { section: AboutSection }) {
  // Narrow each discriminated prop before calling its registered renderer.
  switch (section._type) {
    case "aboutImageLeft":
      return sectionRenderers.aboutImageLeft({ section });
    case "aboutCopyImageCopy":
      return sectionRenderers.aboutCopyImageCopy({ section });
    case "aboutImageRight":
      return sectionRenderers.aboutImageRight({ section });
    case "aboutImageOnly":
      return sectionRenderers.aboutImageOnly({ section });
  }
}

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  return (
    <div className="container about-sections">
      {sections.map((section) => (
        <Fragment key={section._key}>
          <hr className="about-section-divider" aria-hidden="true" />
          <section
            className={`about-authored-section about-authored-section--${section._type}`}
          >
            <SectionContent section={section} />
          </section>
        </Fragment>
      ))}
    </div>
  );
}
