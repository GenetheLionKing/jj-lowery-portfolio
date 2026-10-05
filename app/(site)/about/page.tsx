import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
import { AboutView } from "@/components/about-view";
export const metadata: Metadata = {
  title: "About",
  description:
    "JJ Lowery’s background, systems work, current builds and life outside the screen.",
};
export default async function AboutPage() {
  const { about, cases, articles } = await getPublicContent();
  if (!about) notFound();
  return <AboutView about={about} cases={cases} articles={articles} />;
}
