import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { ArticleBody } from "./article-body";
import { sizedPublicImage } from "@/content/media";
import type { AboutBody, AboutSection } from "@/content/model";
import {
  alignmentStyle,
  type AboutBlockAlignment,
  type TextAlignment,
} from "@/content/about-presentation";

function Copy({
  headline,
  headlineAlignment,
  body,
  bodyAlignments,
}: {
  headline: string;
  headlineAlignment?: TextAlignment;
  body: AboutBody;
  bodyAlignments?: AboutBlockAlignment[];
}) {
  return (
    <div className="about-section-copy">
      <h2 style={alignmentStyle(headlineAlignment)}>{headline}</h2>
      <div className="reading-body about-section-body">
        <ArticleBody
          body={body}
          alignAboutBlocks
          blockAlignments={bodyAlignments}
        />
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
      <Copy
        headline={section.headline}
        headlineAlignment={section.headlineAlignment}
        body={section.body}
        bodyAlignments={section.bodyAlignments}
      />
    </>
  ),
  aboutCopyImageCopy: ({ section }) => (
    <>
      <Copy
        headline={section.leftHeadline}
        headlineAlignment={section.leftHeadlineAlignment}
        body={section.leftBody}
        bodyAlignments={section.leftBodyAlignments}
      />
      <Media image={section.image} />
      <Copy
        headline={section.rightHeadline}
        headlineAlignment={section.rightHeadlineAlignment}
        body={section.rightBody}
        bodyAlignments={section.rightBodyAlignments}
      />
    </>
  ),
  aboutImageRight: ({ section }) => (
    <>
      <Copy
        headline={section.headline}
        headlineAlignment={section.headlineAlignment}
        body={section.body}
        bodyAlignments={section.bodyAlignments}
      />
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
            className={`about-authored-section about-authored-section--${section._type}${section.imageWidth !== undefined ? " about-authored-section--sized" : ""}`}
            style={
              section.imageWidth !== undefined
                ? ({
                    "--about-image-width": `${section.imageWidth}px`,
                  } as CSSProperties)
                : undefined
            }
          >
            <SectionContent section={section} />
          </section>
        </Fragment>
      ))}
    </div>
  );
}
