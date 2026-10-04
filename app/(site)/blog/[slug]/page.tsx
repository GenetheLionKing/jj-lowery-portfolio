import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article-body";
import { ArrowIcon } from "@/components/icons";
import { getPublicContent } from "@/content/public";
import { topicLabel } from "@/content/media";
export const dynamic = "force-static";
export async function generateStaticParams() {
  const { articles } = await getPublicContent();
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = await getPublicContent();
  const article = articles.find((item) => item.slug === slug);
  if (!article)
    return { title: "Page not found", robots: { index: false, follow: false } };
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.summary,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
    },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articles, mode } = await getPublicContent();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <article className="article-page container">
      <Link prefetch={false} href="/blog/" className="text-link back-link">
        <ArrowIcon direction="left" /> All writing
      </Link>
      <header className="article-heading">
        <p className="eyebrow">
          {mode === "seed" ? "Preview draft" : article.format}
          {article.publishedAt && (
            <>
              {" "}
              ·{" "}
              <time dateTime={article.publishedAt}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(article.publishedAt))}
              </time>
            </>
          )}
        </p>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
      </header>
      <div className="article-body">
        <ArticleBody body={article.body} />
      </div>
      {article.tags.length > 0 && (
        <nav className="article-topics" aria-label="Related topics">
          {article.tags.map((topic) => (
            <Link prefetch={false} key={topic} href={`/learn/?topic=${topic}`}>
              {topicLabel(topic)} <ArrowIcon />
            </Link>
          ))}
        </nav>
      )}
    </article>
  );
}
