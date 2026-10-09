import Link from "next/link";
import { AboutSections } from "./about-sections";
import { ArrowIcon } from "@/components/icons";
import { ProfileImage } from "@/components/profile-image";
import { SelectedWorkGrid } from "@/components/selected-work-grid";
import { AboutImageGallery } from "@/components/about-gallery";
import type { About, PublishingCase, Article } from "@/content/model";
function AboutHero({ about }: { about: About }) {
  return (
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
        <ProfileImage sizes="(max-width: 359px) calc(100vw - 32px), (max-width: 400px) calc(100vw - 40px), (max-width: 750px) 360px, (max-width: 900px) 380px, (max-width: 1080px) 50vw, 540px" />
      </div>
    </section>
  );
}

export function AboutView({
  about,
  cases,
  storyHref = "/about/story/",
}: {
  about: About;
  cases: PublishingCase[];
  articles: Article[];
  storyHref?: string;
}) {
  if (about.sections !== undefined)
    return (
      <>
        <AboutHero about={about} />
        <AboutImageGallery items={about.gallery} />
        <AboutSections sections={about.sections} />
      </>
    );
  const builds = about.builds.flatMap((slug) => {
    const study = cases.find((c) => c.slug === slug);
    return study ? [study] : [];
  });
  return (
    <>
      <AboutHero about={about} />
      <AboutImageGallery items={about.gallery} />
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
