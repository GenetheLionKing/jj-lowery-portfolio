import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { experience, profile, skillGroups } from "@/data/profile";
import { caseStudies } from "@/data/case-studies";

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

export default function ResumePage() {
  return (
    <div className="container resume-page">
      <div className="resume-toolbar">
        <Link href="/" className="text-link">
          <span aria-hidden="true">←</span> Back to portfolio
        </Link>
        <PrintButton />
      </div>
      <article className="resume-document">
        <header className="resume-header">
          <p className="eyebrow">Résumé / James (JJ) Lowery</p>
          <h1>
            JAMES (JJ) LOWERY<span>.</span>
          </h1>
          <p className="resume-role">
            SYSTEMS ANALYST | BUSINESS SYSTEMS ANALYST
          </p>
          <address>
            <span>Tucson, AZ | Remote</span>
            <a href={profile.phoneHref}>{profile.phone}</a>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </address>
        </header>
        <section className="resume-section">
          <h2>Professional summary</h2>
          <p>{profile.summary}</p>
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
            {caseStudies.map((study) => (
              <div key={study.slug}>
                <h3>
                  <Link href={`/work/${study.slug}/`}>
                    {study.title} <span aria-hidden="true">↗</span>
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
        <section className="resume-section">
          <h2>Education</h2>
          <div className="resume-education">
            <div>
              <h3>Pima Community College</h3>
              <p>Associate of Arts, Business/Commerce</p>
            </div>
            <span>2009</span>
          </div>
        </section>
      </article>
    </div>
  );
}
