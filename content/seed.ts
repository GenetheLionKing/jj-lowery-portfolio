import { caseStudies } from "../data/case-studies";
import {
  capabilities,
  experience,
  profile,
  skillGroups,
} from "../data/profile";
import {
  aboutSchema,
  articleSchema,
  caseSchema,
  resourceSchema,
  resumeSchema,
  type RichText,
  type PublicContent,
} from "./model";

/** Proposed original writing: Preview review content, not fabricated publication history. */
export function richText(
  items: {
    text: string;
    style?: "normal" | "h2" | "h3" | "blockquote";
    listItem?: "bullet" | "number";
  }[],
): RichText {
  return items.map((item, index) => ({
    _type: "block",
    _key: `block-${index}`,
    style: item.style ?? "normal",
    ...(item.listItem ? { listItem: item.listItem, level: 1 } : {}),
    children: [
      { _type: "span", _key: `span-${index}`, text: item.text, marks: [] },
    ],
    markDefs: [],
  }));
}

const cards: Record<
  string,
  {
    cardTitle: string;
    cardSubtitle: string;
    thumbnail?: "vector-income" | "vector-validation" | "portfolio";
    tags: string[];
    featured: boolean;
    learn: boolean;
  }
> = {
  "vector-income-architecture": {
    cardTitle: "Vector income planning",
    cardSubtitle: "Conceptual model & requirements",
    thumbnail: "vector-income",
    tags: ["learn", "business-rules", "workflows"],
    featured: true,
    learn: true,
  },
  "vector-performance-investigation": {
    cardTitle: "Vector performance",
    cardSubtitle: "Investigation & validation",
    thumbnail: "vector-validation",
    tags: ["learn", "performance", "validation"],
    featured: true,
    learn: true,
  },
  "portfolio-design": {
    cardTitle: "Personal portfolio",
    cardSubtitle: "Website design & development",
    thumbnail: "portfolio",
    tags: ["building", "design"],
    featured: true,
    learn: false,
  },
  "bgm-budget-pacing": {
    cardTitle: "Budget planning and pacing",
    cardSubtitle: "Decision-support systems",
    tags: ["operations"],
    featured: false,
    learn: false,
  },
};

export const seedCases = Object.keys(cards).map((slug) =>
  caseSchema.parse({
    ...caseStudies.find((study) => study.slug === slug),
    ...cards[slug],
    tags: [
      ...cards[slug].tags,
      ...(cards[slug].featured ? ["portfolio", "home"] : []),
    ],
  }),
);

export const seedAbout = aboutSchema.parse({
  title: "about",
  lead: "Business perspective. Systems thinking. Practical building.",
  introduction: [
    "I’ve worked in business and marketing leadership, including executive operations and business ownership.",
    "Today I focus on systems analysis: requirements, business rules, workflows, root-cause analysis, and validation.",
    "I develop Vector, my personal-finance app, with AI assistance.",
  ],
  storyTitle: "The systems underneath the work",
  story: profile.about,
  strengths: capabilities
    .filter((c) =>
      [
        "Requirements & Business Rules",
        "Process & Workflow Analysis",
        "Testing & Validation",
      ].includes(c.title),
    )
    .map((c) => ({ title: c.title, summary: c.description })),
  facts: [
    { label: "Current build", value: "Vector, a personal-finance app" },
    { label: "Focus", value: "Requirements, rules and validation" },
    { label: "Development", value: "AI-assisted, with review and testing" },
  ],
  // Supported by JJ's direct report, relayed by the parent. No duration/ability rating.
  life: [
    {
      title: "A little room for music",
      copy: "Guitars and amps share my workspace.",
    },
  ],
  builds: ["vector-income-architecture", "portfolio-design"],
  storyLinkLabel: "Read the longer story",
});

export const seedResume = resumeSchema.parse({
  name: "JAMES (JJ) LOWERY",
  role: "SYSTEMS ANALYST | BUSINESS SYSTEMS ANALYST",
  location: "Tucson, AZ | Remote",
  summary: profile.summary,
  skillGroups,
  experience,
  selectedProjects: caseStudies
    .filter((s) => s.company === "Vector")
    .map((s) => s.slug),
});

export const seedArticles = [
  articleSchema.parse({
    slug: "a-plan-is-not-money",
    title: "A plan is not money",
    summary:
      "Separate what happened, what is expected and what a plan is allowed to use.",
    image: "vector-income",
    tags: ["learn", "business-rules", "workflows"],
    learn: true,
    featured: true,
    format: "guide",
    body: richText([
      {
        text: "A useful financial system needs more than a total. It needs to distinguish facts from expectations and expectations from decisions. When those concepts share a field, even a simple calendar choice can make the rules difficult to explain.",
      },
      { style: "h2", text: "Name the concepts" },
      {
        text: "Actual income records money that arrived. Expected income is an estimate. Planning intent describes the month a receipt should support. Funding describes the actual money behind that plan. Related concepts can still have different rules.",
      },
      {
        text: "An expectation can inform a plan without creating cash or a financial record. A real receipt can replace the relevant estimate without adding both amounts. A planning relationship can change without changing the transaction date.",
      },
      { style: "h2", text: "Write the boundaries first" },
      { listItem: "bullet", text: "What event creates a financial fact?" },
      {
        listItem: "bullet",
        text: "What can be revised without rewriting history?",
      },
      {
        listItem: "bullet",
        text: "Which amount takes precedence when an estimate becomes real?",
      },
      {
        listItem: "bullet",
        text: "What may the interface suggest, and what must remain an explicit choice?",
      },
      { style: "h2", text: "Turn the model into checks" },
      {
        text: "Use the boundaries as acceptance criteria. Test an expectation with no receipt, a receipt that fulfills an estimate, and a receipt whose date differs from its planning month. The point is to make intended behavior reviewable before deciding how a screen should express it.",
      },
      {
        text: "The related Vector case study is a conceptual model and requirements proposal. It does not claim these behaviors are already implemented.",
      },
    ]),
  }),
  articleSchema.parse({
    slug: "test-the-conditions-not-just-the-feature",
    title: "Test the conditions, not just the feature",
    summary:
      "A passing small test is evidence about that test—not every future workload.",
    image: "vector-validation",
    tags: ["learn", "performance", "validation"],
    learn: true,
    featured: true,
    format: "article",
    body: richText([
      {
        text: "A feature can work correctly in a small test and still fail when real history activates a more expensive path. The useful question is not only whether the feature works, but under which conditions that result holds.",
      },
      { style: "h2", text: "Reproduce the trigger" },
      {
        text: "Start with the conditions surrounding the failure: history size, state, relationships and the path that actually ran. A larger dataset alone may miss the trigger. A faithful reproduction should exercise the same important relationships using synthetic data where appropriate.",
      },
      { style: "h2", text: "Measure a specific explanation" },
      {
        text: "Isolate the work that your hypothesis predicts will become expensive. Measuring a helper can test that explanation. It does not automatically measure the complete application experience.",
      },
      { style: "h2", text: "Keep the meaning intact" },
      {
        text: "A performance change needs correctness checks as well as timing. Test the rules and failure cases the original implementation enforced. If the faster version weakens them, the result is a different system rather than a verified improvement.",
      },
      {
        style: "blockquote",
        text: "A faster result only counts if the system still enforces the same rules.",
      },
      {
        text: "The related Vector investigation reports helper-only measurements from a production-shaped synthetic reproduction. Those figures are not end-to-end application latency benchmarks.",
      },
    ]),
  }),
  articleSchema.parse({
    slug: "a-suggestion-is-not-authorization",
    title: "A suggestion is not authorization",
    summary:
      "Keep a detected pattern, a recommendation and permission to act separate.",
    image: "portfolio",
    tags: ["learn", "business-rules", "validation"],
    learn: true,
    featured: false,
    format: "article",
    body: richText([
      {
        text: "Recognizing a pattern is useful. Treating that recognition as permission to act is a different decision. An understandable automation model keeps those steps separate.",
      },
      { style: "h2", text: "Four different states" },
      {
        listItem: "number",
        text: "Observed pattern: the available evidence suggests a repeated behavior.",
      },
      {
        listItem: "number",
        text: "Suggested automation: the system presents a possible rule for review.",
      },
      {
        listItem: "number",
        text: "Authorized automation: a person deliberately approves the rule and its scope.",
      },
      {
        listItem: "number",
        text: "Successful execution: the rule actually runs under valid current conditions.",
      },
      { style: "h2", text: "Make uncertainty visible" },
      {
        text: "Evidence may be incomplete or conflicting. Define what the system may do in that state, who can resolve the ambiguity and what proof is required before an action becomes eligible. Keep a record that explains which rule authorized an action and whether it completed.",
      },
      {
        text: "These are design principles, not a claim that a particular automation is implemented. They are useful questions when defining requirements, reviewing a workflow or testing an edge case.",
      },
    ]),
  }),
];

export const seedResources = [
  resourceSchema.parse({
    slug: "accessible-interfaces",
    title: "Accessible interfaces",
    summary: "The W3C quick reference for checking accessibility requirements.",
    url: "https://www.w3.org/WAI/WCAG22/quickref/",
    tags: ["design", "validation"],
  }),
  resourceSchema.parse({
    slug: "postgresql-explain",
    title: "Read a query plan",
    summary: "PostgreSQL’s own guide to understanding EXPLAIN output.",
    url: "https://www.postgresql.org/docs/current/using-explain.html",
    tags: ["performance", "building"],
  }),
  resourceSchema.parse({
    slug: "testable-web-interfaces",
    title: "Test web behavior",
    summary: "Playwright’s guide to testing what a user can observe.",
    url: "https://playwright.dev/docs/best-practices",
    tags: ["validation", "building"],
  }),
];

export const seedContent: PublicContent = {
  mode: "seed",
  about: seedAbout,
  resume: seedResume,
  cases: seedCases,
  articles: seedArticles,
  resources: seedResources,
};
