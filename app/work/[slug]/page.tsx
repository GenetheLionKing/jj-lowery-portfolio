import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study";
import { caseStudies } from "@/data/case-studies";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();
  return {
    title: study.title,
    description: study.summary,
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
  const index = caseStudies.findIndex((study) => study.slug === slug);
  if (index === -1) notFound();
  const selectedStudies = caseStudies.filter(
    (study) => study.company === "Vector",
  );
  const selectedIndex = selectedStudies.findIndex(
    (study) => study.slug === slug,
  );
  const nextStudy =
    selectedStudies[(selectedIndex + 1) % selectedStudies.length];
  return <CaseStudyPage study={caseStudies[index]} nextStudy={nextStudy} />;
}
