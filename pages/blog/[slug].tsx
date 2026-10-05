import { EditorialPage } from "@/components/editorial-page";
import type { GetStaticPaths, GetStaticProps } from "next";
import { ArticleBody } from "@/components/article-body";
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
export default function ArticlePage({ article }: Props) {
  return (
    <>
      <PostMetadata
        title={article.seoTitle ?? article.title}
        description={article.seoDescription ?? article.summary}
      />
      <EditorialPage
        title={article.title}
        summary={article.summary}
        backHref="/blog/"
        backLabel="All writing"
        image={article.mainImage}
        label={
          <>
            {article.format}
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
          </>
        }
      >
        <ArticleBody body={article.body} />
      </EditorialPage>
    </>
  );
}
