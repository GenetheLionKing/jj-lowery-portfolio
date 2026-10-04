import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study";
import { getPublicContent } from "@/content/public";
import { selectedCases } from "@/content/catalog";
export const dynamic = "force-static";

export async function generateStaticParams() {
  const { cases } = await getPublicContent();
  return cases.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { cases } = await getPublicContent();
  const study = cases.find((item) => item.slug === slug);
  if (!study)
    return { title: "Page not found", robots: { index: false, follow: false } };
  return {
    title: study.seoTitle ?? study.title,
    description: study.seoDescription ?? study.summary,
    openGraph: {
      title: `${study.title} | JJ Lowery`,
      description: study.summary,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: study.title,
      description: study.summary,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { cases } = await getPublicContent();
  const index = cases.findIndex((study) => study.slug === slug);
  if (index === -1) notFound();
  const selectedStudies = selectedCases(cases);
  const selectedIndex = selectedStudies.findIndex(
    (study) => study.slug === slug,
  );
  const nextStudy =
    selectedStudies.length > 1
      ? selectedStudies[(selectedIndex + 1) % selectedStudies.length]
      : undefined;
  return <CaseStudyPage study={cases[index]} nextStudy={nextStudy} />;
}
