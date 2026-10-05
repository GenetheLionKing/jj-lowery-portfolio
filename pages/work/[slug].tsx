import type { GetStaticPaths, GetStaticProps } from "next";
import { ReadingArticlePage } from "@/components/reading-article";
import { PostMetadata } from "@/components/post-metadata";
import { loadDetailContent, serializableProps } from "@/content/detail";
import {
  caseArticle,
  recentArticles,
  type RecentArticle,
} from "@/content/article";
import type { PublishingCase } from "@/content/model";
type Props = { study: PublishingCase; recent: RecentArticle[] };
export const getStaticPaths: GetStaticPaths = async () => {
  const { cases } = await loadDetailContent();
  return {
    paths: cases.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { cases, articles } = await loadDetailContent();
  const study = cases.find((item) => item.slug === params?.slug);
  if (!study) return { notFound: true, revalidate: 60 };
  return {
    props: serializableProps({
      study,
      recent: recentArticles(cases, articles, `/work/${study.slug}/`),
    }),
    revalidate: 60,
  };
};
export default function WorkPage({ study, recent }: Props) {
  return (
    <>
      <PostMetadata
        title={study.seoTitle ?? study.title}
        description={study.seoDescription ?? study.summary}
      />
      <ReadingArticlePage article={caseArticle(study)} recent={recent} />
    </>
  );
}
