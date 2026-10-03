import Link from "next/link";
import { ProfileImage } from "@/components/profile-image";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner container">
          <h1 id="hero-title" className="sr-only">
            JJ Lowery — business experience, systems analysis
          </h1>
          <p className="hero-intro">Hi, I’m JJ.</p>
          <div className="hero-stage">
            <div className="perspective perspective-business">
              <p className="perspective-title">
                business<span>.</span>
              </p>
              <p>
                Understand the people.
                <br />
                Understand the problem.
              </p>
            </div>
            <ProfileImage />
            <div className="perspective perspective-systems">
              <p className="perspective-title">
                systems<span>.</span>
              </p>
              <p>
                Make the rules clear.
                <br />
                Check that they work.
              </p>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              Tucson, Arizona <span aria-hidden="true">/</span> Open to remote
              systems roles
            </p>
            <a className="text-link" href="#work">
              See the work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="selected-work container"
        aria-labelledby="work-title"
      >
        <div className="work-heading">
          <h2 id="work-title">A closer look.</h2>
          <p>
            Selected work in Vector, my personal-finance app.
            <br />
            Developed with AI assistance.
          </p>
        </div>
        <div className="work-grid">
          <Link
            className="work-link"
            href="/work/vector-income-architecture/"
            prefetch={false}
          >
            <div className="work-visual income-preview" aria-hidden="true">
              <span className="visual-label">01 / Domain modeling</span>
              <div className="income-concepts">
                <span>Expected</span>
                <span className="concept-divider">≠</span>
                <span>Received</span>
              </div>
              <div className="income-paths">
                <span>Informs the plan</span>
                <span>Funds the plan</span>
              </div>
              <svg
                className="income-connectors"
                viewBox="0 0 560 94"
                fill="none"
              >
                <path d="M140 4v25h280V4M280 29v44" />
                <circle cx="140" cy="4" r="3" />
                <circle cx="420" cy="4" r="3" />
                <circle cx="280" cy="77" r="4" />
              </svg>
              <span className="model-note">One plan. Two different facts.</span>
            </div>
            <div className="work-caption">
              <div>
                <p className="work-type">Requirements & business rules</p>
                <h3>Income, without the ambiguity.</h3>
              </div>
              <span className="work-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <p className="work-note">
              A conceptual model & behavioral requirements.
            </p>
            <span className="sr-only">
              Read the Vector income architecture case study.
            </span>
          </Link>
          <Link
            className="work-link"
            href="/work/vector-performance-investigation/"
            prefetch={false}
          >
            <div className="work-visual performance-preview" aria-hidden="true">
              <span className="visual-label">
                02 / Performance investigation
              </span>
              <div className="timing-row">
                <span>Before</span>
                <span>11,136.6 ms</span>
              </div>
              <div className="timing-bar timing-before" />
              <div className="timing-row timing-after-label">
                <span>After</span>
                <strong>
                  41.3<span> ms</span>
                </strong>
              </div>
              <div className="timing-bar timing-after" />
              <span className="measurement-note">
                Helper time · 1,004-row synthetic reproduction
              </span>
            </div>
            <div className="work-caption">
              <div>
                <p className="work-type">Root-cause analysis & validation</p>
                <h3>Find the bottleneck. Keep the rules.</h3>
              </div>
              <span className="work-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <p className="work-note">
              Measured helper improvement; not end-to-end latency.
            </p>
            <span className="sr-only">
              Read the Vector performance investigation case study.
            </span>
          </Link>
        </div>
      </section>

      <section
        id="about"
        className="connect container"
        aria-labelledby="connect-title"
      >
        <div>
          <h2 id="connect-title">Let’s talk systems.</h2>
          <p>Business experience. Curious by nature.</p>
        </div>
        <div className="connect-links">
          <a
            className="text-link"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect on LinkedIn <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link className="text-link" href="/resume/" prefetch={false}>
            View résumé <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
