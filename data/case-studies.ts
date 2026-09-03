export type DiagramKind = "budget" | "income" | "performance";

export type ContentBlock =
  | { type: "text"; paragraphs: string[] }
  | { type: "list"; items: string[] }
  | { type: "principle"; text: string; label?: string }
  | { type: "flow"; steps: { title: string; description?: string }[] }
  | {
      type: "comparison";
      before: { title: string; items: string[] };
      after: { title: string; items: string[] };
    }
  | { type: "diagram"; kind: DiagramKind }
  | { type: "rules"; items: { when: string; then: string }[] }
  | {
      type: "formulas";
      items: { label: string; formula: string }[];
      note: string;
    }
  | { type: "facts"; items: { value: string; label: string }[] };

export type CaseSection = {
  id: string;
  title: string;
  lead?: string;
  blocks: ContentBlock[];
};

export type CaseStudy = {
  slug: string;
  number: string;
  company: string;
  title: string;
  subtitle: string;
  summary: string;
  category: string;
  diagram: DiagramKind;
  metadata: { label: string; value: string }[];
  skills: string[];
  sections: CaseSection[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "bgm-budget-pacing",
    number: "01",
    company: "Boldly Grow Media",
    title: "Advertising Budget Planning & Pacing System",
    subtitle:
      "From repetitive data collection to an operational decision-support system.",
    summary:
      "A Google Sheets-based operating system connecting monthly budget planning, actual spend, projections, and corrective recommendations across a multi-client portfolio.",
    category: "Decision-support systems",
    diagram: "budget",
    metadata: [
      { label: "Context", value: "Boldly Grow Media" },
      { label: "System", value: "Google Sheets + data ingestion" },
      { label: "Scale", value: "Roughly 12–15 brands/accounts at peak" },
      { label: "Use", value: "Company-wide · roughly 1–2 years" },
    ],
    skills: [
      "Process analysis",
      "Data integration",
      "Business rules",
      "Workflow design",
      "Decision support",
      "Automation",
    ],
    sections: [
      {
        id: "problem",
        title: "Problem",
        lead: "Collecting the numbers was consuming the time needed to interpret them.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Across a growing multi-client portfolio, daily spend collection had become repetitive operational work. At scale, manual collection took about one hour per day. The harder problem was connecting those numbers to a plan and deciding what needed to change.",
              "A useful system needed to answer more than “What did we spend?” It needed to connect the original budget, the observed pace, the likely month-end result, and the action required today.",
            ],
          },
          {
            type: "facts",
            items: [
              { value: "~1 hour", label: "Daily manual collection at scale" },
              { value: "12–15", label: "Brands/accounts at peak" },
            ],
          },
        ],
      },
      {
        id: "constraints",
        title: "Constraints",
        lead: "One operating view. Multiple clients, platforms, and changing rates of spend.",
        blocks: [
          {
            type: "list",
            items: [
              "Planning had to reflect each client’s budget and strategy across channels and platforms.",
              "Actual spend needed a consistent daily structure, even as ingestion methods evolved.",
              "Projections had to be understandable enough to use in recurring operational meetings.",
              "The system needed to support both forward planning and an ongoing feedback/control loop.",
            ],
          },
        ],
      },
      {
        id: "analysis",
        title: "Analysis",
        lead: "The reporting task was part of a larger control loop.",
        blocks: [
          {
            type: "comparison",
            before: {
              title: "A collection task",
              items: [
                "Gather spend figures",
                "Enter data manually",
                "Interpret the numbers in isolation",
              ],
            },
            after: {
              title: "An operating system",
              items: [
                "Standardize observation",
                "Compare plan, actual, and projection",
                "Translate a variance into a daily target",
              ],
            },
          },
          {
            type: "text",
            paragraphs: [
              "The important shift was to connect the stages. A plan establishes intent. Actual spend provides evidence. A projection estimates where the current pace leads. Comparing those views makes exceptions visible and gives the team a basis for corrective action.",
            ],
          },
        ],
      },
      {
        id: "system-model",
        title: "System Model",
        lead: "Plan → observe → project → diagnose → act.",
        blocks: [
          { type: "diagram", kind: "budget" },
          {
            type: "flow",
            steps: [
              {
                title: "Planning engine",
                description: "Client budget + strategy → channel/platform plan",
              },
              {
                title: "Observation engine",
                description: "Actual spend data → standardized daily tracker",
              },
              {
                title: "Projection",
                description:
                  "Spend to date + recent spend rate × remaining days",
              },
              {
                title: "Diagnostic layer",
                description: "Compare plan vs actual vs projected outcome",
              },
              {
                title: "Action layer",
                description: "Calculate corrective daily spend requirements",
              },
            ],
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        lead: "Connect data collection to a decision, and the decision to an action.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The Google Sheets system combined monthly budget planning, actual spend tracking, pacing, projections, and corrective recommendations. Data collection evolved from manual entry toward automated ingestion using sources and tools such as Triple Whale, Supermetrics, Dataslayer, Google Analytics, and Google Apps Script.",
            ],
          },
          {
            type: "formulas",
            items: [
              {
                label: "Projected spend",
                formula:
                  "actual spend to date + yesterday’s spend × days remaining",
              },
              {
                label: "Daily increase needed",
                formula: "budget remaining / days left",
              },
              {
                label: "Total daily spend needed",
                formula: "current/yesterday spend + daily increase needed",
              },
            ],
            note: "Reading the formulas: an incremental increase must use the projected budget gap. Total unspent budget ÷ days left instead gives the total daily target; adding the current rate to that would overstate the target. Both calculations require days left greater than zero.",
          },
          {
            type: "flow",
            steps: [
              { title: "Manual reporting" },
              { title: "Automated ingestion" },
              { title: "Standardized reporting" },
              { title: "Budget planning" },
              { title: "Pacing" },
              { title: "Projections" },
              { title: "Exception detection" },
              { title: "Prescribed daily targets" },
            ],
          },
        ],
      },
      {
        id: "validation",
        title: "Validation",
        lead: "The system became part of the operating rhythm.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The system was used company-wide and in recurring meetings for roughly one to two years. Its planning, observation, and correction layers were used together in real operational discussions across the portfolio. The evidence is sustained operational adoption: a shared structure for interpreting the numbers and deciding on corrections.",
            ],
          },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        lead: "A shared structure for seeing the situation and deciding what to do next.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "What began as repetitive reporting developed into a decision-support system: a consistent place to plan, observe, project, diagnose, and prescribe corrective daily targets. The work connected automation to operational judgment, rather than treating data collection as the end goal.",
            ],
          },
          {
            type: "principle",
            text: "Structure the repeatable work so human expertise can be spent where judgment actually matters.",
          },
        ],
      },
    ],
  },
  {
    slug: "vector-income-architecture",
    number: "02",
    company: "Vector",
    title: "Redesigning Income Planning Around Real Cash Flow",
    subtitle: "When a UI problem turned out to be a domain-modeling problem.",
    summary:
      "Separating actual income, expectations, planning intent, and funding to define financial behavior that stays consistent with reality.",
    category: "Domain modeling & requirements",
    diagram: "income",
    metadata: [
      { label: "Context", value: "Vector · personal-finance application" },
      { label: "Focus", value: "Domain modeling & business rules" },
      { label: "Starting point", value: "Calendar / month-allocation UX" },
      {
        label: "Deliverable",
        value: "Conceptual model & behavioral requirements",
      },
    ],
    skills: [
      "Domain modeling",
      "Requirements analysis",
      "Business rules",
      "Edge cases",
      "Acceptance criteria",
      "Data integrity",
    ],
    sections: [
      {
        id: "problem",
        title: "Problem",
        lead: "A month-allocation interface was trying to answer several different questions at once.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The apparent problem concerned a calendar and the month to which income should belong. But “belongs to this month” was doing too much work: describing when money arrived, when it was expected, and which month’s budget it should support.",
              "Changing the interface alone would leave those meanings collapsed. The domain model needed to distinguish them before the workflow could become clear.",
            ],
          },
          {
            type: "principle",
            label: "Central insight",
            text: "What happened is not the same thing as what I expect to happen, and neither is necessarily the same thing as which month’s plan the money supports.",
          },
        ],
      },
      {
        id: "constraints",
        title: "Constraints",
        lead: "Planning convenience cannot change financial reality.",
        blocks: [
          {
            type: "list",
            items: [
              "Expected income must not create cash or ledger rows.",
              "Receipt date and budget-month support must remain independent.",
              "Actual income should supersede an estimate when appropriate, without double-counting.",
              "Planning and funding are related but distinct.",
              "Historical integrity must be preserved when a plan changes.",
            ],
          },
        ],
      },
      {
        id: "analysis",
        title: "Analysis",
        lead: "Four concepts. Four different responsibilities.",
        blocks: [
          {
            type: "comparison",
            before: {
              title: "Collapsed model",
              items: [
                "A month implies both receipt and support",
                "An expectation risks behaving like cash",
                "A planning change risks rewriting history",
              ],
            },
            after: {
              title: "Separated model",
              items: [
                "Transaction date records when it happened",
                "Actual and expected income stay distinct",
                "Budget-month support expresses planning intent",
              ],
            },
          },
          {
            type: "text",
            paragraphs: [
              "Transaction date anchors an event in time. Actual income represents money received. Expected income represents an estimate. Budget-month support answers which month’s plan the money is intended to support. Funding then asks whether actual money is available to back the plan.",
            ],
          },
        ],
      },
      {
        id: "system-model",
        title: "System Model",
        lead: "Reality, expectation, planning intent, and funding are separate layers.",
        blocks: [
          { type: "diagram", kind: "income" },
          {
            type: "rules",
            items: [
              {
                when: "Reality",
                then: "What happened? Record actual income with its transaction date.",
              },
              {
                when: "Expectation",
                then: "What do I think will happen? Keep the estimate separate from cash and the Ledger.",
              },
              {
                when: "Planning intent",
                then: "Which month’s plan should this support? Make that choice independent of receipt date.",
              },
              {
                when: "Funding",
                then: "What actual money backs the plan? An expectation alone cannot supply it.",
              },
            ],
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        lead: "Define the behavior before deciding how the interface should express it.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The redesign centers on explicit relationships between the concepts. Expected income informs planning without creating financial records. A real receipt establishes actual income. Where appropriate, the actual amount supersedes its estimate instead of being added to it. Budget-month support can express intent without rewriting the receipt date.",
            ],
          },
          {
            type: "rules",
            items: [
              {
                when: "An expectation is added",
                then: "The plan can consider it. Cash and ledger rows do not change.",
              },
              {
                when: "Actual income arrives",
                then: "Use the actual amount and supersede the relevant estimate when appropriate. Do not count both.",
              },
              {
                when: "Budget-month support changes",
                then: "Change the planning relationship. Preserve the original transaction date and historical record.",
              },
            ],
          },
        ],
      },
      {
        id: "validation",
        title: "Validation",
        lead: "Make the requirements testable at the boundaries.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The model’s acceptance criteria define the required behavior at four boundaries: cash creation, reconciliation with an estimate, month support, and historical integrity.",
            ],
          },
          {
            type: "rules",
            items: [
              {
                when: "Expected income exists; no money has arrived",
                then: "No new cash and no ledger row exist because of the expectation.",
              },
              {
                when: "A receipt fulfills an expectation",
                then: "The actual amount supersedes the applicable estimate without double-counting.",
              },
              {
                when: "Receipt month differs from support month",
                then: "The model preserves both facts independently.",
              },
              {
                when: "A planning choice is revised",
                then: "Historical income remains intact, and funding is still based on actual money.",
              },
            ],
          },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        lead: "A clearer model makes the next design decision less ambiguous.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "The analysis reframed a calendar UX issue as a domain-modeling problem. The resulting model gives requirements, interface decisions, and validation a shared vocabulary: what happened, what is expected, which plan the money supports, and what actually funds that plan.",
            ],
          },
          {
            type: "principle",
            text: "Make the system understandable before making it automatic.",
          },
        ],
      },
    ],
  },
  {
    slug: "vector-performance-investigation",
    number: "03",
    company: "Vector",
    title: "Diagnosing a Production-Scale Performance Failure",
    subtitle:
      "A feature that worked at test scale failed when real production history activated the full read path.",
    summary:
      "A production-shaped reproduction isolated an expensive database helper. A minimal redesign reduced measured helper time while preserving existing behavior.",
    category: "Root-cause analysis & validation",
    diagram: "performance",
    metadata: [
      { label: "Context", value: "Vector · Bank Activity reads" },
      { label: "Production shape", value: "Approximately 1,004 rows" },
      {
        label: "Measured result",
        value: "11,136.6 ms → 41.3 ms · helper time",
      },
      {
        label: "Safety boundary",
        value: "No production or staging data mutation",
      },
    ],
    skills: [
      "Root-cause analysis",
      "Production-shaped reproduction",
      "SQL",
      "Performance analysis",
      "Regression testing",
      "Change validation",
    ],
    sections: [
      {
        id: "problem",
        title: "Problem",
        lead: "A real Starting Point turned a working feature into an HTTP 500.",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Production contained approximately 1,004 Bank Activity rows. A real Starting Point activated the full historical read path, and subsequent Bank Activity reads returned HTTP 500.",
              "The failure was tied to the conditions under which the feature ran. A prior proof using 300 rows had stayed below timeout; that result had not established behavior at the production scale.",
            ],
          },
          {
            type: "facts",
            items: [
              { value: "300 rows", label: "Prior proof stayed below timeout" },
              { value: "1,004 rows", label: "Production-shaped reproduction" },
            ],
          },
        ],
      },
      {
        id: "constraints",
        title: "Constraints",
        lead: "Restore performance without weakening the rules.",
        blocks: [
          {
            type: "list",
            items: [
              "Preserve existing semantics and fail-closed behavior.",
              "Reproduce the production conditions with synthetic data.",
              "Do not mutate production or staging data during the hotfix investigation.",
              "Validate the change with broad regression coverage.",
            ],
          },
        ],
      },
      {
        id: "analysis",
        title: "Analysis",
        lead: "Test the scale hypothesis with the read path fully activated.",
        blocks: [
          {
            type: "flow",
            steps: [
              {
                title: "Incident",
                description: "Bank Activity reads return HTTP 500.",
              },
              {
                title: "Context",
                description:
                  "A real Starting Point activates full historical reads.",
              },
              {
                title: "Hypothesis",
                description:
                  "Work below the timeout at 300 rows may exceed it at production scale.",
              },
              {
                title: "Reproduce",
                description:
                  "Use a production-shaped, 1,004-row synthetic dataset.",
              },
              {
                title: "Isolate",
                description:
                  "Measure the database helper involved in row-level validation.",
              },
              {
                title: "Redesign",
                description:
                  "Optimize the helper while preserving its semantics.",
              },
              {
                title: "Verify",
                description:
                  "Measure the improvement and run broad regression coverage.",
              },
            ],
          },
        ],
      },
      {
        id: "system-model",
        title: "System Model",
        lead: "Repeated validation made helper cost a read-path problem.",
        blocks: [
          {
            type: "flow",
            steps: [
              {
                title: "Real Starting Point",
                description: "Activates the full historical read path",
              },
              {
                title: "Bank Activity history",
                description: "Approximately 1,004 production rows",
              },
              {
                title: "Row-level validation",
                description: "Calls a database helper",
              },
              {
                title: "Timezone catalog scan",
                description: "Expensive work inside that helper",
              },
            ],
          },
          {
            type: "text",
            paragraphs: [
              "The root cause was a database helper that scanned PostgreSQL timezone catalog data during row-level validation. The production-shaped reproduction exposed a scaling failure that the earlier 300-row proof had not crossed.",
            ],
          },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        lead: "Change the cost of validation while keeping its meaning.",
        blocks: [
          {
            type: "comparison",
            before: {
              title: "Deployed helper",
              items: [
                "Timezone catalog scan during row-level validation",
                "Measured time: 11,136.6 ms",
              ],
            },
            after: {
              title: "Optimized helper",
              items: [
                "Existing semantics and fail-closed behavior preserved",
                "Measured time: 41.3 ms",
              ],
            },
          },
          {
            type: "text",
            paragraphs: [
              "The fix focused on the measured helper bottleneck. It reduced the cost without relaxing the existing rules or changing the intended behavior. The improvement was evaluated using the production-shaped synthetic reproduction.",
            ],
          },
        ],
      },
      {
        id: "validation",
        title: "Validation",
        lead: "Performance and correctness were both part of the result.",
        blocks: [
          {
            type: "list",
            items: [
              "A 1,004-row synthetic reproduction exercised the scaling conditions.",
              "The deployed and optimized helpers were measured: 11,136.6 ms and 41.3 ms, respectively.",
              "Validation included broad regression coverage.",
              "Existing semantics and fail-closed behavior were preserved.",
              "No production or staging data was mutated during the hotfix investigation.",
            ],
          },
          {
            type: "principle",
            label: "Validation principle",
            text: "A faster result only counts if the system still enforces the same rules.",
          },
        ],
      },
      {
        id: "outcome",
        title: "Outcome",
        lead: "A measured improvement, grounded in the conditions that caused the failure.",
        blocks: [
          { type: "diagram", kind: "performance" },
          {
            type: "text",
            paragraphs: [
              "Measured helper time fell from 11,136.6 ms to 41.3 ms—approximately a 99.6% reduction, or 270× faster. These figures describe the helper measurement, not an end-to-end application latency benchmark.",
              "The investigation connected an incident, a context trigger, a scale hypothesis, a faithful reproduction, and a measured bottleneck. That chain of evidence made a focused fix possible without sacrificing financial application behavior.",
            ],
          },
        ],
      },
    ],
  },
];
