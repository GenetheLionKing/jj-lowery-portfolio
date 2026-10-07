import { ReadingArticlePage } from "@/components/reading-article";
import type { RichText } from "@/content/model";
/** Neutral Portable Text fixture. No draft query, CMS record or public listing. */
const paragraph = (
  key: string,
  text: string,
  style: "normal" | "h2" = "normal",
): RichText[number] => ({
  _type: "block",
  _key: key,
  style,
  children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  markDefs: [],
});
const body: RichText = [
  paragraph(
    "intro",
    "This local fixture checks the ordinary article renderer, including an inline image and caption. It is not a proposed article or a CMS record.",
  ),
  paragraph("heading", "A clear reading order", "h2"),
  paragraph(
    "reading",
    "The title, subtitle, author and body share a centered reading column. Paragraphs and meaningful headings stay visible without JavaScript.",
  ),
  {
    _type: "image",
    _key: "inline-image",
    src: "/images/work/vector-income.webp",
    width: 640,
    height: 480,
    alt: "Vector’s envelope-planning interface",
    caption:
      "Existing public artwork, used here to check image placement and captions.",
  },
  paragraph(
    "end",
    "Images are optional. Publication dates appear only when their history is supplied; this fixture has no date.",
  ),
];
export default async function ArticleLayoutReview({
  searchParams,
}: {
  searchParams: Promise<{ cta?: string }>;
}) {
  const { cta } = await searchParams;
  return (
    <ReadingArticlePage
      article={{
        title: "Article layout review",
        subtitle: "A plain reading template for future Posts.",
        body,
        ...(cta === "none"
          ? {}
          : {
              ctaText:
                cta === "long"
                  ? "Visit Vector and explore a clearer way to organize your budget and spending"
                  : "Visit Vector",
              ctaUrl: "https://vectorbudget.com",
            }),
      }}
      recent={[{ title: "Another article", href: "/blog/" }]}
    />
  );
}
