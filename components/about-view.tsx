import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ProfileImage } from "@/components/profile-image";
import { SelectedWorkGrid } from "@/components/selected-work-grid";
import { AboutGalleryStrip } from "@/components/about-gallery";
import { aboutGallery } from "@/content/catalog";
import type { About, PublishingCase, Article } from "@/content/model";
export function AboutView({
  about,
  cases,
  articles,
  storyHref = "/about/story/",
}: {
  about: About;
  cases: PublishingCase[];
  articles: Article[];
  storyHref?: string;
}) {
  const features = aboutGallery(articles, cases);
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
          </div>
          <ProfileImage sizes="(max-width: 750px) 280px, (max-width: 900px) 355px, 457px" />
        </div>
      </section>
      <AboutGalleryStrip items={features} />
      {(about.strengths.length > 0 || about.facts.length > 0) && (
        <section className="about-band">
          <div className="container about-section about-reading">
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
            {about.facts.length > 0 && (
              <div className="about-visual">
                <dl className="about-facts">
                  {about.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}
      {about.life.length > 0 && (
        <section className="container about-section about-life about-reading">
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
          <Link prefetch={false} className="text-link" href={storyHref}>
            {about.storyLinkLabel}
            <ArrowIcon />
          </Link>
        </section>
      )}
    </>
  );
}
