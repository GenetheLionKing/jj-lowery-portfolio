"use client";

import { set, unset, useFormValue, type StringInputProps } from "sanity";
import { type SkillRelationship } from "../content/about-skill-tree";

/** A native select with named sibling choices and stable saved keys. */
export function SkillPrerequisiteInput(props: StringInputProps) {
  const value = useFormValue(props.path.slice(0, -2));
  const key = props.path.at(-2);
  const ownKey = typeof key === "object" && key && "_key" in key ? key._key : undefined;
  const nodes = Array.isArray(value) ? value.filter((node): node is SkillRelationship => !!node && typeof node._key === "string") : [];
  const own = nodes.find((node) => node._key === ownKey);
  const byKey = new Map(nodes.map((node) => [node._key, node]));
  const choices = nodes.filter((candidate) => {
    if (!own || candidate._key === ownKey || (candidate.tier ?? 1) >= (own.tier ?? 1)) return false;
    const visited = new Set<string>();
    let current: SkillRelationship | undefined = candidate;
    while (current) {
      if (current._key === ownKey || visited.has(current._key)) return false;
      visited.add(current._key);
      if (!current.prerequisite) return true;
      const parent = byKey.get(current.prerequisite);
      if (!parent || (parent.tier ?? 1) >= (current.tier ?? 1)) return false;
      current = parent;
    }
    return false;
  });
  const unavailable = props.value && !choices.some((node) => node._key === props.value);
  return <select {...props.elementProps} value={props.value || ""} disabled={props.readOnly} aria-invalid={!!props.validationError}
    style={{ width: "100%", padding: "0.75rem", font: "inherit" }}
    onChange={(event) => props.onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())}>
    <option value="">Foundational / no prerequisite</option>
    {choices.map((node) => <option key={node._key} value={node._key}>{node.name || "Untitled skill"}</option>)}
    {unavailable && <option value={props.value}>Unavailable prerequisite; choose another</option>}
  </select>;
}
