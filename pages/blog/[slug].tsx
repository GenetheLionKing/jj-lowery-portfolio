import type { GetStaticPaths, GetStaticProps } from "next";
import { ReadingArticlePage } from "@/components/reading-article";
import { PostMetadata } from "@/components/post-metadata";
import { loadDetailContent, serializableProps } from "@/content/detail";
import {
  postArticle,
  recentArticles,
  type RecentArticle,
} from "@/content/article";
import type { Article } from "@/content/model";
type Props = { article: Article; recent: RecentArticle[] };
export const getStaticPaths: GetStaticPaths = async () => {
  const { articles } = await loadDetailContent();
  return {
    paths: articles
      .filter((item) => item.destination === "article")
      .map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { articles, cases } = await loadDetailContent();
  const article = articles.find(
    (item) => item.slug === params?.slug && item.destination === "article",
  );
  if (!article) return { notFound: true, revalidate: 60 };
  return {
    props: serializableProps({
      article,
      recent: recentArticles(cases, articles, `/blog/${article.slug}/`),
    }),
    revalidate: 60,
  };
};
export default function ArticlePage({ article, recent }: Props) {
  return (
    <>
      <PostMetadata
        title={article.seoTitle ?? article.title}
        description={article.seoDescription ?? article.summary}
      />
      <ReadingArticlePage article={postArticle(article)} recent={recent} />
    </>
  );
}
