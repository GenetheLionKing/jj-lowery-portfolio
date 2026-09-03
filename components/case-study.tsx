import Link from "next/link";
import type { CaseStudy, ContentBlock } from "@/data/case-studies";
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
                <span aria-hidden="true">↳</span>
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
  study: CaseStudy;
  nextStudy: CaseStudy;
}) {
  return (
    <>
      <div className="case-hero container">
        <Link href="/#work" className="text-link back-link">
          <span aria-hidden="true">←</span> All selected work
        </Link>
        <div className="case-hero-top">
          <p className="eyebrow">
            Case study {study.number} <span>/</span> {study.company}
          </p>
          <span className="micro case-category">{study.category}</span>
        </div>
        <h1>{study.title}</h1>
        <p className="case-subtitle">{study.subtitle}</p>
        <SystemDiagram kind={study.diagram} />
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
        <aside className="case-sidebar">
          <nav aria-label="Case study sections">
            <p className="micro">In this study</p>
            <ol>
              {[
                ...study.sections,
                { id: "skills", title: "Skills Demonstrated" },
              ].map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span className="micro">0{index + 1}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
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
              {section.lead && <p className="section-lead">{section.lead}</p>}
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} />
              ))}
            </section>
          ))}
          <section className="case-section" id="skills">
            <div className="case-section-heading">
              <span className="micro">08</span>
              <h2>Skills Demonstrated</h2>
            </div>
            <SkillTags skills={study.skills} />
          </section>
        </article>
      </div>
      <div className="next-study">
        <div className="container">
          <span className="micro">
            Continue exploring / Case study {nextStudy.number}
          </span>
          <Link href={`/work/${nextStudy.slug}/`}>
            <span>{nextStudy.title}</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/#work" className="text-link">
            Back to selected work
          </Link>
        </div>
      </div>
    </>
  );
}
