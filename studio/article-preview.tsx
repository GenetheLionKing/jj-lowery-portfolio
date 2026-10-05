import { useClient } from "sanity";
import type { UserViewComponent } from "sanity/structure";
import type { Article, PublishingCase } from "../content/model";
import { previewPost } from "../content/preview-post";
import { caseArticle, postArticle } from "../content/article";
import { ReadingArticlePage } from "../components/reading-article";

export const ArticlePreview: UserViewComponent = ({ document }) => {
  const client = useClient({ apiVersion: "2026-10-01" });
  const config = client.config();
  const doc = document.displayed;
  if (!doc)
    return (
      <p className="studio-preview-status">
        Write a Post in the Form tab to preview it here.
      </p>
    );
  let parsed: Article | PublishingCase | null;
  try {
    parsed = previewPost(
      doc,
      { projectId: config.projectId!, dataset: config.dataset! },
      document.published?._updatedAt,
    );
  } catch {
    parsed = null;
  }
  if (!parsed)
    return (
      <div className="studio-article-preview">
        <p className="studio-preview-status">
          Complete the title, description, URL and article body in the Form tab.
          Images need alternative text. Validation details appear in the Form
          tab; this preview does not publish anything.
        </p>
      </div>
    );
  if ("destination" in parsed && parsed.destination !== "article")
    return (
      <div className="studio-article-preview">
        <p className="studio-preview-status">
          This Post links to{" "}
          {parsed.destination === "external"
            ? parsed.externalUrl
            : parsed.customPage}
          . Its selected pages will show a card linking to that destination
          after publication.
        </p>
        <h1>{parsed.title}</h1>
        <p>{parsed.summary}</p>
      </div>
    );
  const article =
    "sections" in parsed ? caseArticle(parsed) : postArticle(parsed);
  return (
    <div className="studio-article-preview">
      <p className="studio-preview-status">
        Studio preview ·{" "}
        {document.draft ? "unpublished changes" : "published content"}.
        Placement and Recent articles update on the public site after
        publication.
        {doc.kind === "caseStudy" && !doc.body
          ? " This archived Post renders as an article. Use “Edit as article” to copy its existing text into the rich-text editor."
          : ""}
      </p>
      <ReadingArticlePage article={article} />
    </div>
  );
};
