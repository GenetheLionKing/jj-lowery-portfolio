import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleBody } from "@/components/article-body";
import { ArrowIcon } from "@/components/icons";
import { sizedPublicImage } from "@/content/media";
import { PostMetadata } from "@/components/post-metadata";
import { loadDetailContent, serializableProps } from "@/content/detail";
import type { Article } from "@/content/model";
type Props = { article: Article; mode: "seed" | "sanity" };
export const getStaticPaths: GetStaticPaths = async () => {
  const { articles } = await loadDetailContent();
  return {
    paths: articles.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { articles, mode } = await loadDetailContent();
  const article = articles.find((item) => item.slug === params?.slug);
  if (!article) return { notFound: true, revalidate: 60 };
  return { props: serializableProps({ article, mode }), revalidate: 60 };
};
export default function ArticlePage({ article, mode }: Props) {
  return (
    <article className="article-page container">
      <PostMetadata
        title={article.seoTitle ?? article.title}
        description={article.seoDescription ?? article.summary}
      />
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
      {article.mainImage && (
        <Image
          unoptimized
          className="article-main-image"
          src={sizedPublicImage(article.mainImage.src, 960)}
          alt={article.mainImage.alt}
          width={article.mainImage.width}
          height={article.mainImage.height}
        />
      )}
      <div className="article-body">
        <ArticleBody body={article.body} />
      </div>
    </article>
  );
}
