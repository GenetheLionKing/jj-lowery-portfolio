import type { GetStaticPaths, GetStaticProps } from "next";
import { CaseStudyPage } from "@/components/case-study";
import { PostMetadata } from "@/components/post-metadata";
import { loadDetailContent, serializableProps } from "@/content/detail";
import { selectedCases } from "@/content/catalog";
import type { PublishingCase } from "@/content/model";
type Props = {
  study: PublishingCase;
  nextStudy?: Pick<PublishingCase, "number" | "title" | "slug">;
};
export const getStaticPaths: GetStaticPaths = async () => {
  const { cases } = await loadDetailContent();
  return {
    paths: cases.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { cases } = await loadDetailContent();
  const study = cases.find((item) => item.slug === params?.slug);
  if (!study) return { notFound: true, revalidate: 60 };
  const selected = selectedCases(cases);
  const index = selected.findIndex((item) => item.slug === study.slug);
  const nextStudy =
    selected.length > 1 ? selected[(index + 1) % selected.length] : undefined;
  return {
    props: serializableProps({
      study,
      nextStudy: nextStudy
        ? {
            slug: nextStudy.slug,
            title: nextStudy.title,
            number: nextStudy.number,
          }
        : undefined,
    }),
    revalidate: 60,
  };
};
export default function WorkPage({ study, nextStudy }: Props) {
  return (
    <>
      <PostMetadata
        title={study.seoTitle ?? study.title}
        description={study.seoDescription ?? study.summary}
      />
      <CaseStudyPage study={study} nextStudy={nextStudy} />
    </>
  );
}
