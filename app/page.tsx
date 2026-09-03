import Link from "next/link";
import { ProfileImage } from "@/components/profile-image";
import { SystemDiagram } from "@/components/diagrams";
import {
  approach,
  capabilities,
  experience,
  profile,
  supportingWork,
} from "@/data/profile";
import { caseStudies } from "@/data/case-studies";

function SectionTitle({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-header">
      <p className="eyebrow">
        <span>{number} /</span> {label}
      </p>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-topline">
          <p className="eyebrow">
            Systems Analyst <span>·</span> Business Systems Analyst
          </p>
          <span className="micro hero-location">
            <span className="status-dot" />
            Tucson, Arizona · Remote
          </span>
        </div>
        <div className="hero-composition">
          <div className="hero-copy">
            <p className="hero-name" aria-label="JJ Lowery">
              JJ LOWERY<span>.</span>
            </p>
            <h1 id="hero-title">
              I turn messy processes and disconnected information into{" "}
              <em>clear, reliable systems.</em>
            </h1>
            <p className="hero-description">{profile.description}</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/#work">
                View My Work <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/resume/">
                View Résumé <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="hero-portrait">
            <div className="portrait-note micro">
              <span aria-hidden="true">+</span> Human perspective.
              <br />
              Systems thinking.
            </div>
            <ProfileImage />
            <span className="portrait-side-label micro" aria-hidden="true">
              Observe / understand / improve
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <span className="micro">Business context. Technical depth.</span>
          <span className="micro hero-bottom-center">
            Investigate → Model → Verify
          </span>
          <a href="#work" className="micro">
            Explore the work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="work" className="work-section section-space">
        <div className="container">
          <SectionTitle
            number="01"
            label="Selected systems work"
            title="The thinking. The work. The proof."
            description="Three systems problems. A closer look at the investigation, the model, and the evidence behind each solution."
          />
          <div className="flagship-list">
            {caseStudies.map((study) => (
              <article
                className={`flagship-card flagship-${study.diagram}`}
                key={study.slug}
              >
                <div className="flagship-copy">
                  <p className="micro case-label">
                    Case study {study.number}
                    <span>{study.company}</span>
                  </p>
                  <p className="project-category micro">{study.category}</p>
                  <h3>
                    <Link href={`/work/${study.slug}/`}>{study.title}</Link>
                  </h3>
                  <p className="flagship-subtitle">{study.subtitle}</p>
                  <p className="flagship-summary">{study.summary}</p>
                  <Link
                    className="text-link case-read"
                    href={`/work/${study.slug}/`}
                  >
                    Read case study <span aria-hidden="true">↗</span>
                    <span className="sr-only">: {study.title}</span>
                  </Link>
                </div>
                <div className="flagship-visual">
                  <SystemDiagram kind={study.diagram} compact />
                  <span className="visual-index" aria-hidden="true">
                    0{Number(study.number)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="capabilities"
        className="container section-space capabilities-section"
      >
        <SectionTitle
          number="02"
          label="Capabilities"
          title="From ambiguity to something that works."
          description="A practical toolkit for understanding systems and making them more reliable."
        />
        <div className="capability-grid">
          {capabilities.map((capability, index) => (
            <article key={capability.title}>
              <span className="micro capability-number">
                0{index + 1}
                <span aria-hidden="true">↗</span>
              </span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="approach-section section-space"
        aria-labelledby="approach-heading"
      >
        <div className="container">
          <p className="eyebrow">
            <span>03 /</span> How I approach systems problems
          </p>
          <div className="approach-intro">
            <h2 id="approach-heading">
              Make the system <em>understandable</em> before making it automatic
              <span>.</span>
            </h2>
            <div className="approach-annotation">
              <span className="micro">A working principle</span>
              <p>
                Good systems start with better questions. Then the model, the
                implementation, and the evidence have to agree.
              </p>
            </div>
          </div>
          <ol className="approach-grid">
            {approach.map((step, index) => (
              <li key={step.title}>
                <div className="approach-step">
                  <span className="micro">0{index + 1}</span>
                  <span aria-hidden="true">
                    {index === approach.length - 1 ? "↙" : "→"}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="approach-bottom">
            <span className="micro">The purpose of structure</span>
            <p>
              Structure the repeatable work so human expertise can be spent
              where judgment actually matters.
            </p>
          </div>
        </div>
      </section>

      <section className="container section-space supporting-section">
        <SectionTitle
          number="04"
          label="Supporting systems work"
          title="The same lens. Different systems."
        />
        <div className="supporting-grid">
          {supportingWork.map((work, index) => (
            <article
              key={work.title}
              className={index === 0 ? "supporting-featured" : undefined}
            >
              <p className="micro supporting-meta">
                {work.company}
                <span>{String(index + 1).padStart(2, "0")}</span>
              </p>
              <h3>{work.title}</h3>
              <p>{work.summary}</p>
              {work.details && <p>{work.details}</p>}
              <span className="supporting-category micro">{work.category}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="experience-section section-space">
        <div className="container experience-layout">
          <div>
            <p className="eyebrow">
              <span>05 /</span> Experience
            </p>
            <h2>
              Business experience.
              <br />
              <em>Systems perspective.</em>
            </h2>
            <Link className="text-link" href="/resume/">
              View full résumé <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ol className="experience-list">
            {experience.map((role) => (
              <li key={role.company}>
                <span className="micro">{role.dates}</span>
                <div>
                  <h3>{role.company}</h3>
                  <p>{role.title}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="about" className="container section-space about-section">
        <div className="about-label">
          <p className="eyebrow">
            <span>06 /</span> About
          </p>
          <div className="about-symbol" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="about-copy">
          <h2>
            I’ve always been interested in the system{" "}
            <em>underneath the work.</em>
          </h2>
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="about-signature">
            James “JJ” Lowery <span className="micro">Tucson, Arizona</span>
          </p>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-heading">
        <div className="container">
          <p className="eyebrow">Let’s connect</p>
          <div className="contact-layout">
            <div>
              <h2 id="contact-heading">
                Have a system that needs <em>untangling?</em>
              </h2>
              <p>
                I’m pursuing remote Systems Analyst, Business Systems Analyst,
                Applications Analyst, and related systems-focused opportunities.
              </p>
            </div>
            <div className="contact-actions">
              <a
                className="button button-dark"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
