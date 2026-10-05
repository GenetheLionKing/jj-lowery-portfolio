import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/icons";
import type { ContentBlock } from "@/data/case-studies";
import type { PublishingCase } from "@/content/model";
import { publicMedia, sizedPublicImage } from "@/content/media";
import {
  MetricCallouts,
  Principle,
  ProcessFlow,
  SkillTags,
  SystemDiagram,
} from "@/components/diagrams";

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      );
    case "list":
      return (
        <ul className="evidence-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "principle":
      return <Principle text={block.text} label={block.label} />;
    case "flow":
      return <ProcessFlow steps={block.steps} />;
    case "diagram":
      return <SystemDiagram kind={block.kind} />;
    case "facts":
      return <MetricCallouts items={block.items} />;
    case "comparison":
      return (
        <div className="comparison">
          {[block.before, block.after].map((side, i) => (
            <div key={side.title}>
              <span className="micro">
                {i === 0 ? "Before / current state" : "After / future state"}
              </span>
              <h3>{side.title}</h3>
              <ul>
                {side.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "rules":
      return (
        <dl className="rules">
          {block.items.map((rule) => (
            <div key={rule.when}>
              <dt>{rule.when}</dt>
              <dd>
                <ArrowIcon direction="right" />
                {rule.then}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "formulas":
      return (
        <div className="formulas">
          {block.items.map((formula) => (
            <div key={formula.label}>
              <h3 className="micro">{formula.label}</h3>
              <p>{formula.formula}</p>
            </div>
          ))}
          <p className="formula-note">{block.note}</p>
        </div>
      );
  }
}

export function CaseStudyPage({
  study,
  nextStudy,
}: {
  study: PublishingCase;
  nextStudy?: Pick<PublishingCase, "number" | "title" | "slug">;
}) {
  return (
    <>
      <div className="case-hero container">
        <Link
          prefetch={false}
          href="/portfolio/"
          className="text-link back-link"
        >
          <ArrowIcon direction="left" /> All selected work
        </Link>
        <div className="case-introduction">
          <div className="case-heading">
            <p className="eyebrow">
              {study.company} · {study.category}
            </p>
            <h1>{study.title}</h1>
            <p className="case-subtitle">{study.subtitle}</p>
            {study.company === "Vector" && (
              <p className="case-method">
                My personal-finance app, developed with AI assistance.
              </p>
            )}
          </div>
          <div className="case-visual">
            {study.mainImage ? (
              <Image
                unoptimized
                src={sizedPublicImage(study.mainImage.src, 960)}
                alt={study.mainImage.alt}
                width={study.mainImage.width}
                height={study.mainImage.height}
                priority
              />
            ) : study.thumbnail ? (
              <Image
                unoptimized
                src={publicMedia[study.thumbnail].src}
                alt={publicMedia[study.thumbnail].alt}
                width={640}
                height={480}
                priority
              />
            ) : study.image ? (
              <Image
                unoptimized
                src={study.image.src}
                alt={study.image.alt}
                width={640}
                height={480}
                priority
              />
            ) : study.diagram ? (
              <SystemDiagram kind={study.diagram} />
            ) : null}
          </div>
        </div>
        <dl className="case-metadata">
          {study.metadata.map((item) => (
            <div key={item.label}>
              <dt className="micro">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="container case-body">
        <details className="case-outline">
          <summary>In this case study</summary>
          <nav aria-label="Case study sections">
            <ol>
              {[
                ...study.sections,
                { id: "skills", title: "Skills demonstrated" },
              ].map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        </details>
        <article
          className="case-article"
          aria-label={`${study.title} analysis`}
        >
          {study.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="case-section">
              <div className="case-section-heading">
                <span className="micro">0{index + 1}</span>
                <h2>{section.title}</h2>
              </div>
              <div className="case-section-content">
                {section.lead && <p className="section-lead">{section.lead}</p>}
                {section.blocks.map((block, blockIndex) => (
                  <Block key={blockIndex} block={block} />
                ))}
              </div>
            </section>
          ))}
          <section className="case-section" id="skills">
            <div className="case-section-heading">
              <span className="micro">
                {String(study.sections.length + 1).padStart(2, "0")}
              </span>
              <h2>Skills Demonstrated</h2>
            </div>
            <div className="case-section-content">
              <SkillTags skills={study.skills} />
            </div>
          </section>
        </article>
      </div>
      {nextStudy && (
        <div className="next-study">
          <div className="container">
            <span className="micro">
              Continue exploring / Case study {nextStudy.number}
            </span>
            <Link prefetch={false} href={`/work/${nextStudy.slug}/`}>
              <span>{nextStudy.title}</span>
              <ArrowIcon />
            </Link>
            <Link prefetch={false} href="/portfolio/" className="text-link">
              Back to selected work
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
