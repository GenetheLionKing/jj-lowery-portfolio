import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { ProfileImage } from "@/components/profile-image";
import { MusicArt, SystemsArt } from "@/components/about-art";
import { SelectedWorkGrid } from "@/components/selected-work-grid";
import { getPublicContent } from "@/content/public";
import { contentHref } from "@/content/catalog";
import { publicMedia, type PublicMediaKey } from "@/content/media";
export const metadata: Metadata = {
  title: "About",
  description:
    "JJ Lowery’s background, systems work, current builds and life outside the screen.",
};
export default async function AboutPage() {
  const { about, cases, articles } = await getPublicContent();
  if (!about) notFound();
  const features = about.featureLinks.flatMap((ref) => {
    if (ref.kind === "caseStudy") {
      const item = cases.find((c) => c.slug === ref.slug);
      return item
        ? [
            {
              href: contentHref(ref.kind, ref.slug),
              label: ref.label ?? item.title,
              image: item.thumbnail as PublicMediaKey | undefined,
            },
          ]
        : [];
    }
    const item = articles.find((a) => a.slug === ref.slug);
    return item
      ? [
          {
            href: contentHref(ref.kind, ref.slug),
            label: ref.label ?? item.title,
            image: item.image as PublicMediaKey | undefined,
          },
        ]
      : [];
  });
  const builds = about.builds.flatMap((slug) => {
    const study = cases.find((c) => c.slug === slug);
    return study ? [study] : [];
  });
  return (
    <>
      <section className="info-page about-page" aria-labelledby="about-title">
        <div className="container about-layout">
          <div className="about-copy">
            <h1 id="about-title" className="page-title">
              {about.title}
            </h1>
            <div className="page-copy">
              {about.introduction.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href="/resume/"
              prefetch={false}
              className="text-link page-link"
            >
              View résumé <ArrowIcon />
            </Link>
          </div>
          <ProfileImage sizes="(max-width: 750px) 280px, (max-width: 900px) 355px, 457px" />
        </div>
      </section>
      {features.length > 0 && (
        <nav
          className="container story-strip"
          aria-label="Stories from the work"
        >
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} prefetch={false}>
              {feature.image && (
                <Image
                  unoptimized
                  src={publicMedia[feature.image].src}
                  alt=""
                  width={640}
                  height={480}
                  loading="lazy"
                />
              )}
              <span>
                {feature.label}
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </nav>
      )}
      {(about.strengths.length > 0 || about.facts.length > 0) && (
        <section className="about-band">
          <div className="container about-section">
            <div>
              <p className="eyebrow">Analysis & building</p>
              <h2>{about.lead}</h2>
              <div className="about-strengths">
                {about.strengths.map((strength) => (
                  <div key={strength.title}>
                    <h3>{strength.title}</h3>
                    <p>{strength.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-visual">
              <SystemsArt />
              <dl className="about-facts">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}
      {about.life.length > 0 && (
        <section className="container about-section about-life">
          <div className="about-visual">
            <MusicArt />
          </div>
          <div>
            <p className="eyebrow">Outside the work</p>
            {about.life.map((item) => (
              <div key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {builds.length > 0 && (
        <section className="about-band about-builds">
          <div className="container">
            <header className="section-intro">
              <p className="eyebrow">In progress</p>
              <h2>What I’m building</h2>
            </header>
            <SelectedWorkGrid cases={builds} headingLevel="h3" />
          </div>
        </section>
      )}
      {about.story.length > 0 && (
        <section className="container about-story-cta">
          <div>
            <p className="eyebrow">The background</p>
            <h2>{about.storyTitle}</h2>
          </div>
          <Link prefetch={false} className="text-link" href="/about/story/">
            {about.storyLinkLabel}
            <ArrowIcon />
          </Link>
        </section>
      )}
    </>
  );
}
