import { EditorialPage } from "@/components/editorial-page";
/** Neutral layout fixture, never a CMS record, article proposal or public listing. */
export default function ArticleLayoutReview() {
  return (
    <EditorialPage
      title="Article layout review"
      summary="A reading template for future published posts."
      label="Layout fixture"
      backHref="/blog/"
      backLabel="Blog"
    >
      <p>
        This page exists only to review the article template. It is not a
        published post and does not appear in Blog, Learn, Portfolio or the
        homepage.
      </p>
      <h2>A clear reading order</h2>
      <p>
        The introduction, headings and body share a comfortable reading width.
        Paragraphs remain visible without JavaScript, and links can be reached
        with a keyboard.
      </p>
      <blockquote>
        Content should be easy to read before it asks for attention.
      </blockquote>
      <h2>Keep useful structure</h2>
      <ul>
        <li>Use headings to describe each section.</li>
        <li>Show a date only when one is supplied.</li>
        <li>Keep images optional and their alternative text meaningful.</li>
      </ul>
    </EditorialPage>
  );
}
