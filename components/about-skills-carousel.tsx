"use client";

import Image from "next/image";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { AboutSkillNode, AboutSkillTree } from "@/content/model";
import { skillTreeGeometry, skillTreeLayout } from "@/content/about-skill-tree";
import { sizedPublicImage } from "@/content/media";
import { ArticleBody } from "./article-body";
import { useClientReady, useManualCarousel } from "./use-manual-carousel";

function SkillTree({ tree }: { tree: AboutSkillTree }) {
  const [selectedKey, select] = useState(tree.nodes[0]?._key);
  const enhanced = useClientReady();
  const active = tree.nodes.find((node) => node._key === selectedKey) ?? tree.nodes[0];
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const detailsRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const titleId = useId();
  const desktop = skillTreeLayout(tree.nodes, 5);
  const mobile = skillTreeLayout(tree.nodes, 2);
  const narrow = skillTreeLayout(tree.nodes, 1);
  const ordered = desktop.positions.map((position) => tree.nodes.find((node) => node._key === position.key)!);

  const details = (node: AboutSkillNode) => <>
    <p className="about-skill-tree__state">{node.status === "locked" ? "Locked" : "Unlocked"}{node.currentRank ? ` · Current rank: ${node.currentRank}` : ""}</p>
    {node.prerequisite && <p className="about-skill-tree__prerequisite">Builds on {tree.nodes.find((parent) => parent._key === node.prerequisite)?.name}</p>}
    <ArticleBody body={node.body} />
    <ol className="about-skill-tree__ranks" aria-label={`${node.name} rank descriptions`}>
      {([1, 2, 3, 4] as const).map((rank) => <li key={rank}>
        <h4>Rank {rank}</h4>
        <ArticleBody body={node.ranks[`rank${rank}`]} />
      </li>)}
    </ol>
  </>;

  function keyDown(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const layout = typeof window !== "undefined" && window.matchMedia("(max-width: 360px)").matches
      ? narrow : typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches ? mobile : desktop;
    const index = layout.positions.findIndex((position) => position.key === key);
    const current = layout.positions[index];
    const candidates = layout.positions.filter((position) => event.key === "ArrowDown" ? position.row > current.row : position.row < current.row);
    const nextRow = event.key === "ArrowDown" ? Math.min(...candidates.map((position) => position.row)) : Math.max(...candidates.map((position) => position.row));
    const vertical = candidates.filter((position) => position.row === nextRow)
      .sort((a, b) => Math.abs(a.column - current.column) - Math.abs(b.column - current.column))[0];
    const next = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1
      : event.key === "ArrowDown" || event.key === "ArrowUp" ? vertical ? layout.positions.indexOf(vertical) : index
      : event.key === "Home" ? 0 : event.key === "End" ? layout.positions.length - 1 : undefined;
    if (next === undefined) return;
    event.preventDefault();
    const position = layout.positions[Math.max(0, Math.min(layout.positions.length - 1, next))];
    if (position) { select(position.key); buttons.current.get(position.key)?.focus(); }
  }

  function focusAndReveal(element: HTMLElement | null | undefined) {
    if (!element) return;
    element.focus({ preventScroll: true });
    // Scroll the page directly so the horizontal viewport never scrolls vertically.
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 16, behavior: "instant" });
  }

  function showDetails(key: string) {
    select(key);
    // Long mobile trees must reveal the changed content at the time of selection.
    focusAndReveal(detailsRef.current);
  }

  if (!active) return null;
  if (!enhanced) return <div className="about-skill-tree__fallback">
    {ordered.map((node) => <details key={node._key}>
      <summary>
        <Image unoptimized src={sizedPublicImage(node.badge.src, 160)} width={node.badge.width} height={node.badge.height} alt={node.badge.alt} loading="lazy" />
        <span>{node.name} · Tier {node.tier} · {node.status === "locked" ? "Locked" : "Unlocked"}</span>
      </summary>
      <div className="reading-body about-section-body">{details(node)}</div>
    </details>)}
  </div>;
  return <div className="about-skill-tree">
    <div className="about-skill-tree__diagram" style={{
      "--skill-row-height": `${skillTreeGeometry.row}px`, "--skill-columns": desktop.columns,
      "--skill-rows": desktop.rows, "--skill-columns-mobile": mobile.columns,
      "--skill-rows-mobile": mobile.rows, "--skill-rows-narrow": narrow.rows,
    } as CSSProperties}>
      {[desktop, mobile, narrow].map((layout, index) => <div key={index} className={`about-skill-tree__layer about-skill-tree__layer--${index}`}>
        {layout.tiers.map((tier) => <div key={tier.tier} className="about-skill-tree__tier" data-tier={tier.tier}
          style={{ top: tier.row * skillTreeGeometry.row, height: tier.rows * skillTreeGeometry.row - 8 }}>
          <span>Tier {tier.tier}{tier.count === 0 ? " · No skills in this tier" : ""}</span>
        </div>)}
        <svg className="about-skill-tree__connections" aria-hidden="true"
          viewBox={`0 0 ${layout.columns * skillTreeGeometry.column} ${layout.rows * skillTreeGeometry.row}`} preserveAspectRatio="none">
          {layout.connections.map((connection, index) => <path key={index} d={connection} vectorEffect="non-scaling-stroke" />)}
        </svg>
      </div>)}
      <div className="about-skill-tree__nodes" role="group" aria-label={`${tree.title} skills`}>
        {ordered.map((node) => {
          const large = desktop.positions.find((position) => position.key === node._key)!;
          const small = mobile.positions.find((position) => position.key === node._key)!;
          const smallest = narrow.positions.find((position) => position.key === node._key)!;
          return <button key={node._key} ref={(element) => {
            if (element) buttons.current.set(node._key, element); else buttons.current.delete(node._key);
          }} type="button" aria-pressed={active._key === node._key} aria-controls={panelId} data-state={node.status}
            style={{ "--skill-row": large.row + 1, "--skill-column": large.column + 1,
              "--skill-row-mobile": small.row + 1, "--skill-column-mobile": small.column + 1,
              "--skill-row-narrow": smallest.row + 1 } as CSSProperties}
            onClick={() => showDetails(node._key)} onKeyDown={(event) => keyDown(event, node._key)}>
            <span className="about-skill-tree__shield">
              <svg aria-hidden="true" viewBox="0 0 100 136"><polygon points="50,3 97,25 97,111 50,133 3,111 3,25" /></svg>
              <Image unoptimized src={sizedPublicImage(node.badge.src, 160)} width={node.badge.width} height={node.badge.height} alt={node.badge.alt} loading="lazy" />
            </span>
            <span>{node.name}</span>
            <span className="about-skill-tree__badge-state">{node.status === "locked" ? "Locked" : "Unlocked"}</span>
          </button>;
        })}
      </div>
    </div>
    <section id={panelId} ref={detailsRef} tabIndex={-1} className="about-skill-tree__details reading-body about-section-body" aria-labelledby={titleId}>
      <h3 id={titleId}>{active.name}</h3>
      <p className="sr-only" role="status">Selected skill: {active.name}. {active.status === "locked" ? "Locked" : "Unlocked"}.</p>
      {details(active)}
      <button className="about-skill-tree__back" type="button" onClick={() => {
        const button = buttons.current.get(active._key);
        focusAndReveal(button);
      }}>Back to badges</button>
    </section>
  </div>;
}

export function AboutSkillsCarousel({ trees, label }: { trees: AboutSkillTree[]; label: string }) {
  const visible = trees.filter((tree) => tree.nodes.length);
  const { activeIndex, viewportRef, slidesRef, navigate, onScroll, onKeyDown, onFocus } = useManualCarousel(visible.map((tree) => tree._key));
  const enhanced = useClientReady();
  const id = useId();
  if (!visible.length) return null;
  return <div className="about-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
    <p className="about-carousel__hint">Explore a category, then choose any badge to read its description and all four ranks.</p>
    <div className="about-carousel__controls">
      {enhanced && visible.length > 1 && <button type="button" aria-label="Previous skill tree" aria-controls={id} aria-disabled={activeIndex === 0} onClick={() => navigate(activeIndex - 1)}>Previous</button>}
      <p role="status" aria-live={enhanced ? "polite" : "off"}>{enhanced ? `${visible[activeIndex].title}, ${activeIndex + 1} of ${visible.length}` : `${visible.length} ${visible.length === 1 ? "category" : "categories"}`}</p>
      {enhanced && visible.length > 1 && <button type="button" aria-label="Next skill tree" aria-controls={id} aria-disabled={activeIndex === visible.length - 1} onClick={() => navigate(activeIndex + 1)}>Next</button>}
    </div>
    <ul id={id} ref={viewportRef} className="about-carousel__slides" tabIndex={visible.length > 1 ? 0 : undefined}
      aria-label="Skill tree slides" onScroll={onScroll} onKeyDown={onKeyDown} onFocusCapture={onFocus}>
      {visible.map((tree, index) => <li key={tree._key} ref={(node) => { slidesRef.current[index] = node; }}
        role="group" aria-roledescription="slide" aria-label={`${tree.title}, ${index + 1} of ${visible.length}`}>
        <header className="about-skill-tree__header" data-color={tree.headerColor}><h3>{tree.title}</h3></header>
        <SkillTree tree={tree} />
      </li>)}
    </ul>
  </div>;
}
