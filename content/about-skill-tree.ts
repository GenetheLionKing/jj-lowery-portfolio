export const skillTreeLimits = { trees: 8, nodes: 20, tiers: 4, perTier: 5, name: 32 } as const;
export const skillTreeGeometry = { column: 160, row: 256, top: 16, bottom: 240 } as const;
export type SkillRelationship = { _key: string; name: string; tier?: number; prerequisite?: string | null };

/** Four independently authored tiers; relationships describe skills, never lock them. */
export function skillTreeIssue(nodes: SkillRelationship[]): string | undefined {
  const byKey = new Map(nodes.map((node) => [node._key, node]));
  if (byKey.size !== nodes.length) return "Skill keys must be unique within a tree";
  const counts = new Map<number, number>();
  for (const node of nodes) {
    const tier = node.tier ?? 1;
    if (!Number.isInteger(tier) || tier < 1 || tier > skillTreeLimits.tiers) return "Choose a tier from 1 to 4";
    counts.set(tier, (counts.get(tier) ?? 0) + 1);
    if (counts.get(tier)! > skillTreeLimits.perTier) return `Tier ${tier} can contain up to five skills; move a skill to another tier or tree`;
    if (node.prerequisite && !byKey.has(node.prerequisite)) return `Choose an existing prerequisite for ${node.name}`;
    const visited = new Set<string>();
    let current: SkillRelationship | undefined = node;
    while (current) {
      if (visited.has(current._key)) return "Prerequisites cannot form a cycle";
      visited.add(current._key);
      current = current.prerequisite ? byKey.get(current.prerequisite) : undefined;
    }
  }
  for (const node of nodes) {
    if (node.prerequisite && (byKey.get(node.prerequisite)!.tier ?? 1) >= (node.tier ?? 1)) return `The prerequisite for ${node.name} must be in an earlier tier`;
  }
}

export function skillTreeLayout(nodes: SkillRelationship[], maximumColumns: number) {
  if (skillTreeIssue(nodes)) return { columns: 1, rows: 0, positions: [] as { key: string; row: number; column: number }[], tiers: [] as { tier: number; row: number; rows: number; count: number }[], connections: [] as string[] };
  if (!nodes.length) return { columns: 1, rows: 0, positions: [], tiers: [], connections: [] };
  const levels = new Map<number, SkillRelationship[]>();
  for (const node of nodes) { const tier = node.tier ?? 1; levels.set(tier, [...(levels.get(tier) ?? []), node]); }
  const columns = Math.max(1, Math.min(maximumColumns, Math.max(0, ...[...levels.values()].map((level) => level.length))));
  const positions: { key: string; row: number; column: number }[] = [];
  const tiers: { tier: number; row: number; rows: number; count: number }[] = [];
  let row = 0;
  for (let tier = 1; tier <= skillTreeLimits.tiers; tier++) {
    const level = levels.get(tier) ?? [];
    const rows = Math.max(1, Math.ceil(level.length / columns));
    tiers.push({ tier, row, rows, count: level.length });
    level.forEach((node, index) => positions.push({ key: node._key, row: row + Math.floor(index / columns), column: index % columns }));
    row += rows;
  }
  const positionMap = new Map(positions.map((position) => [position.key, position]));
  const connections = nodes.filter((node) => node.prerequisite).map((node) => {
    const parent = positionMap.get(node.prerequisite!)!, child = positionMap.get(node._key)!;
    const x1 = parent.column * skillTreeGeometry.column + 80, y1 = parent.row * skillTreeGeometry.row + skillTreeGeometry.bottom;
    const x2 = child.column * skillTreeGeometry.column + 80, y2 = child.row * skillTreeGeometry.row + skillTreeGeometry.top;
    // Follow the gaps between rows and columns rather than crossing other badges.
    const gutter = (parent.column + 1) * skillTreeGeometry.column - (parent.column === columns - 1 ? 4 : 0);
    return `M ${x1} ${y1} V ${y1 + 8} H ${gutter} V ${y2 - 8} H ${x2} V ${y2}`;
  });
  return { columns, rows: row, positions, tiers, connections };
}
