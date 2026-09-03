import type { DiagramKind } from "@/data/case-studies";

export function ProcessFlow({
  steps,
  label = "Process flow",
}: {
  steps: { title: string; description?: string }[];
  label?: string;
}) {
  return (
    <ol className="process-flow" aria-label={label}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="step-index micro">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <strong>{step.title}</strong>
            {step.description && <p>{step.description}</p>}
          </div>
          {index < steps.length - 1 && (
            <span className="flow-arrow" aria-hidden="true">
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function Principle({
  text,
  label = "Working principle",
}: {
  text: string;
  label?: string;
}) {
  return (
    <aside className="principle">
      <span className="micro">{label}</span>
      <p>“{text}”</p>
    </aside>
  );
}

export function MetricCallouts({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <dl className="metric-callouts">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SkillTags({ skills }: { skills: string[] }) {
  return (
    <ul className="skill-tags" aria-label="Skills demonstrated">
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}

export function SystemDiagram({
  kind,
  compact = false,
}: {
  kind: DiagramKind;
  compact?: boolean;
}) {
  if (kind === "budget") {
    return (
      <figure
        className={`system-diagram budget-diagram ${compact ? "compact" : ""}`}
      >
        <figcaption className="diagram-caption micro">
          <span>Budget control loop</span>
          <span aria-hidden="true">Fig. 01</span>
        </figcaption>
        <div className="budget-visual">
          <div className="budget-input">
            <span className="micro">Input</span>
            <span>Budget + strategy</span>
          </div>
          <ol className="budget-loop" aria-label="Budget control loop">
            {["Plan", "Observe", "Project", "Diagnose", "Act"].map(
              (step, index) => (
                <li key={step}>
                  <span className="micro">0{index + 1}</span>
                  <strong>{step}</strong>
                  {index < 4 && (
                    <span className="loop-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </li>
              ),
            )}
          </ol>
          <div className="feedback-line">
            <span>Actual spend informs the next decision</span>
            <span aria-hidden="true">↵</span>
          </div>
        </div>
        <p className="diagram-foot micro">
          Forward planning + continuous feedback
        </p>
      </figure>
    );
  }
  if (kind === "income") {
    return (
      <figure
        className={`system-diagram income-diagram ${compact ? "compact" : ""}`}
      >
        <figcaption className="diagram-caption micro">
          <span>One system. Four distinct concepts.</span>
          <span aria-hidden="true">Fig. 02</span>
        </figcaption>
        <dl className="income-layers">
          {[
            {
              name: "Reality",
              description: "What happened",
              code: "01",
              note: "Actual income + transaction date",
            },
            {
              name: "Expectation",
              description: "What may happen",
              code: "02",
              note: "An estimate, never cash",
            },
            {
              name: "Planning intent",
              description: "Which month it supports",
              code: "03",
              note: "Independent of receipt date",
            },
            {
              name: "Funding",
              description: "What backs the plan",
              code: "04",
              note: "Actual money available",
            },
          ].map((layer) => (
            <div key={layer.code}>
              <dt>
                <span className="micro">{layer.code}</span>
                {layer.name}
              </dt>
              <dd>
                {layer.description}
                {!compact && <small>{layer.note}</small>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="diagram-foot micro">
          Related concepts ≠ interchangeable concepts
        </p>
      </figure>
    );
  }
  return (
    <figure
      className={`system-diagram performance-diagram ${compact ? "compact" : ""}`}
    >
      <figcaption className="diagram-caption micro">
        <span>Measured helper execution time</span>
        <span aria-hidden="true">Fig. 03</span>
      </figcaption>
      <div className="performance-numbers">
        <div>
          <span className="micro">Before</span>
          <strong>
            11,136.6<span> ms</span>
          </strong>
        </div>
        <span className="performance-arrow" aria-hidden="true">
          ↘
        </span>
        <div className="after-number">
          <span className="micro">After</span>
          <strong>
            41.3<span> ms</span>
          </strong>
        </div>
      </div>
      <div className="performance-bars" aria-hidden="true">
        <div />
        <div />
      </div>
      <div className="performance-result">
        <span>
          <strong>~99.6%</strong> reduction
        </span>
        <span>
          <strong>~270×</strong> faster
        </span>
      </div>
      <p className="diagram-foot micro">
        1,004-row synthetic reproduction · semantics preserved
      </p>
    </figure>
  );
}
