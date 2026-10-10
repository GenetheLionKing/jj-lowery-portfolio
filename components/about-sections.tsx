import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { ArticleBody } from "./article-body";
import { sizedPublicImage } from "@/content/media";
import type { AboutBody, AboutSection, PublicImage } from "@/content/model";
import { AboutImageCarousel } from "./about-image-carousel";
import { AboutSkillsCarousel } from "./about-skills-carousel";
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
  headline?: string | null;
  headlineAlignment?: TextAlignment;
  body: AboutBody;
  bodyAlignments?: AboutBlockAlignment[];
}) {
  return (
    <div className="about-section-copy">
      {headline && <h2 style={alignmentStyle(headlineAlignment)}>{headline}</h2>}
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
  image: PublicImage;
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
  aboutImageCarousel: ({ section }) => (
    <>
      {(section.headline || section.body?.length) && <Copy headline={section.headline} headlineAlignment={section.headlineAlignment} body={section.body ?? []} bodyAlignments={section.bodyAlignments} />}
      <AboutImageCarousel items={section.images} label={section.headline || "About image carousel"} />
    </>
  ),
  aboutSkillsCarousel: ({ section }) => (
    <>
      <Copy headline={section.headline || "My skills"} headlineAlignment={section.headlineAlignment} body={section.body ?? []} bodyAlignments={section.bodyAlignments} />
      <AboutSkillsCarousel trees={section.trees} label={section.headline || "My skills"} />
    </>
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
    case "aboutImageCarousel":
      return sectionRenderers.aboutImageCarousel({ section });
    case "aboutSkillsCarousel":
      return sectionRenderers.aboutSkillsCarousel({ section });
  }
}

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  const visible = sections.filter((section) =>
    (section._type !== "aboutImageCarousel" || section.images.length > 0) &&
    (section._type !== "aboutSkillsCarousel" || section.trees.some((tree) => tree.nodes.length)),
  );
  // Empty new sections do not reserve a divider or a padded content area.
  if (sections.length && !visible.length) return null;
  return (
    <div className="container about-sections">
      {visible.map((section) => (
        <Fragment key={section._key}>
          <hr className="about-section-divider" aria-hidden="true" />
          <section
            className={`about-authored-section about-authored-section--${section._type}${"imageWidth" in section && section.imageWidth !== undefined ? " about-authored-section--sized" : ""}`}
            style={
              "imageWidth" in section && section.imageWidth !== undefined
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
