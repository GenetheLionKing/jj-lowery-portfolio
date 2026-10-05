import type { ReactNode } from "react";
/** Shared composition: one title, short lead and a substantial relevant visual. */
export function IndexHero({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="index-hero" aria-labelledby={id}>
      <div className="container index-hero-layout">
        <div className="index-hero-copy">
          <h1 id={id} className="page-title">
            {title}
          </h1>
          <p className="index-hero-lead">{lead}</p>
        </div>
        <div className="index-hero-visual">{children}</div>
      </div>
    </section>
  );
}
export function LearningArt() {
  return (
    <svg className="learning-art" viewBox="0 0 520 360" aria-hidden="true">
      <g fill="var(--paper)" stroke="currentColor" strokeWidth="2">
        <path d="M72 80h172l16 16 16-16h172v240H276l-16 16-16-16H72Z" />
        <path d="M260 96v240M96 56h116l32 24H96ZM276 80l32-24h116v24" />
        <path
          d="M108 120h96M108 140h68M108 164h96M108 184h84M108 208h56"
          stroke="var(--line-strong)"
        />
        <rect x="302" y="124" width="100" height="48" rx="5" />
        <path d="M352 172v28h-40v24M352 200h40v24" />
        <rect x="292" y="224" width="40" height="40" rx="5" />
        <rect x="372" y="224" width="40" height="40" rx="5" />
      </g>
      <g fill="none" stroke="var(--accent)" strokeWidth="3">
        <path d="m306 242 7 7 13-15M384 240l16 12M400 240l-16 12" />
        <path d="M108 250h88M108 270h68" />
      </g>
    </svg>
  );
}
