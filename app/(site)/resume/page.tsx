import { AppPageAnalytics } from "@/components/app-analytics";
import { ArrowIcon } from "@/components/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { getPublicContent } from "@/content/public";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Résumé — Systems Analyst & Business Systems Analyst",
  description:
    "James (JJ) Lowery’s professional résumé: systems analysis, business rules, workflow design, automation, and application validation.",
  openGraph: {
    title: "James (JJ) Lowery — Résumé",
    description:
      "Systems Analyst | Business Systems Analyst · Tucson, AZ | Remote",
  },
};

export default async function ResumePage() {
  const { resume, cases } = await getPublicContent();
  if (!resume) notFound();
  const { experience, skillGroups } = resume;
  return (
    <div className="container resume-page">
      <AppPageAnalytics path="/resume/" />
      <div className="resume-toolbar">
        <Link href="/" className="text-link">
          <ArrowIcon direction="left" /> Back to portfolio
        </Link>
        <PrintButton />
      </div>
      <article className="resume-document">
        <header className="resume-header">
          <p className="eyebrow">Résumé / James (JJ) Lowery</p>
          <h1>
            {resume.name}
            <span>.</span>
          </h1>
          <p className="resume-role">{resume.role}</p>
          <address>
            <span>{resume.location}</span>
          </address>
        </header>
        <section className="resume-section">
          <h2>Professional summary</h2>
          <p>{resume.summary}</p>
        </section>
        <section className="resume-section">
          <h2>Core skills</h2>
          <div className="resume-skills">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="resume-section">
          <h2>Selected systems work</h2>
          <div className="resume-projects">
            {cases
              .filter((study) => resume.selectedProjects.includes(study.slug))
              .map((study) => (
                <div key={study.slug}>
                  <h3>
                    <Link href={`/work/${study.slug}/`}>
                      {study.title} <ArrowIcon />
                    </Link>
                  </h3>
                  <p className="resume-company">{study.company}</p>
                  <p>{study.summary}</p>
                </div>
              ))}
          </div>
        </section>
        <section className="resume-section">
          <h2>Professional experience</h2>
          <div className="resume-experience">
            {experience.map((role) => (
              <div key={role.company}>
                <div>
                  <h3>{role.title}</h3>
                  <p>{role.company}</p>
                </div>
                <span>{role.dates}</span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
