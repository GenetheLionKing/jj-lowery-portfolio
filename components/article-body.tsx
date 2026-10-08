import {
  PortableText,
  type PortableTextComponentProps,
} from "@portabletext/react";
import { createElement } from "react";
import type { AboutBody, RichText } from "@/content/model";
import {
  alignmentStyle,
  blockAlignment,
  type AboutBlockAlignment,
} from "@/content/about-presentation";
import Image from "next/image";
import { sizedPublicImage } from "@/content/media";
import { SystemDiagram } from "./diagrams";
type AlignedBlockValue = { _type: string; alignment?: unknown };
const alignedBlock = (tag: "p" | "h2" | "h3" | "blockquote") => {
  return function AlignedBlock({
    value,
    children,
  }: PortableTextComponentProps<AlignedBlockValue>) {
    return createElement(
      tag,
      { style: alignmentStyle(value.alignment) },
      children,
    );
  };
};
const alignedListItem = ({
  value,
  children,
}: PortableTextComponentProps<AlignedBlockValue>) => (
  <li style={alignmentStyle(value.alignment)}>{children}</li>
);
const aboutBlockComponents = {
  block: {
    normal: alignedBlock("p"),
    h2: alignedBlock("h2"),
    h3: alignedBlock("h3"),
    blockquote: alignedBlock("blockquote"),
  },
  listItem: alignedListItem,
};

export function ArticleBody({
  body,
  alignAboutBlocks = false,
  blockAlignments,
}: {
  body: RichText | AboutBody;
  alignAboutBlocks?: boolean;
  blockAlignments?: AboutBlockAlignment[];
}) {
  const value = alignAboutBlocks
    ? body.map((block) =>
        block._type === "block"
          ? { ...block, alignment: blockAlignment(blockAlignments, block._key) }
          : block,
      )
    : body;
  return (
    <PortableText
      value={value}
      components={{
        ...(alignAboutBlocks ? aboutBlockComponents : {}),
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
