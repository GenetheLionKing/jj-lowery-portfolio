import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { createClient } from "@sanity/client";
import { createSchema, FormValueProvider, type StringInputProps } from "sanity";
import { AboutImageCarousel } from "../components/about-image-carousel";
import { AboutSkillsCarousel } from "../components/about-skills-carousel";
import { AboutSections } from "../components/about-sections";
import { AboutView } from "../components/about-view";
import { aboutSchema, aboutSectionSchema, aboutSkillTreeSchema, type AboutCarouselImage, type AboutSkillNode, type AboutSkillTree } from "../content/model";
import { skillTreeLayout, skillTreeLimits } from "../content/about-skill-tree";
import { nativeAboutData } from "../content/native-about";
import { decodePublishedContent, publishedQuery } from "../content/read";
import { seedAbout, seedCases, seedArticles } from "../content/seed";
import { schemaTypes } from "../studio/schema";
import { SkillPrerequisiteInput } from "../studio/skill-prerequisite-input";

const config = { projectId: "validation", dataset: "portfolio" };
const image = { src: "https://cdn.sanity.io/images/validation/portfolio/test-2400x1350.webp", alt: "A fixture infographic", width: 2400, height: 1350 };
const images: AboutCarouselImage[] = Array.from({ length: 18 }, (_, index) => ({ ...image, _key: `image-${index}`, alt: `Fixture slide ${index + 1}`, caption: index === 0 ? "A <caption>" : undefined }));
const nativeImage = { _type: "image", asset: { _type: "reference", _ref: "image-test-2400x1350-webp" }, alt: image.alt };
const paragraph = (text: string, key = "paragraph") => ({ _type: "block" as const, _key: key, style: "normal" as const, children: [{ _type: "span" as const, _key: "span", text, marks: [] as string[] }], markDefs: [] });
const node = (key: string, prerequisite?: string): AboutSkillNode => ({ _type: "aboutSkillNode", _key: key, name: key, tier: prerequisite ? 2 : 1, status: "unlocked", badge: image, body: [paragraph(`Details for ${key}`)], ranks: { _type: "aboutSkillRanks", rank1: [paragraph(`Rank 1 for ${key}`)], rank2: [paragraph(`Rank 2 for ${key}`)], rank3: [paragraph(`Rank 3 for ${key}`)], rank4: [paragraph(`Rank 4 for ${key}`)] }, prerequisite });
const tree: AboutSkillTree = { _type: "aboutSkillTree", _key: "tree", title: "Fixture category", headerColor: "emerald", nodes: [node("advanced", "foundation"), node("foundation"), node("second"), node("middle", "foundation")] };
const imageSection = { _type: "aboutImageCarousel" as const, _key: "images", images: images.slice(0, 3) };
const skillSection = { _type: "aboutSkillsCarousel" as const, _key: "skills", trees: [tree] };
const nativeTree = { ...tree, nodes: tree.nodes.map((item) => ({ ...item, badge: nativeImage })) };
const nativeSections = [{ ...imageSection, images: images.slice(0, 3).map((item) => ({ ...nativeImage, _key: item._key, alt: item.alt, caption: item.caption })) }, { ...skillSection, trees: [nativeTree] }];
const compiled = createSchema({ name: "about-carousels-validation", types: schemaTypes });
const sanityRequire = createRequire(createRequire(import.meta.url).resolve("sanity"));
const { validateDocument } = sanityRequire("@sanity/validation");
const nativeValidate = (sections: unknown[]) => validateDocument({ document: { _id: "drafts.about", _type: "about", title: "About", introduction: [], sections }, schema: compiled, client: createClient({ ...config, apiVersion: "2026-10-01", useCdn: false, requestHandler: async () => { throw new Error("No CMS calls in local tests"); } }), customValidation: true, getDocumentExists: async () => true }) as Promise<{ status: string; markers: { message: string; path: unknown[] }[] }>;

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("image carousel accepts zero through eighteen whole images and rejects unsafe or ambiguous media", () => {
  for (let count = 0; count <= 18; count++) assert.equal(aboutSectionSchema.safeParse({ ...imageSection, images: images.slice(0, count) }).success, true);
  for (const value of [undefined, null]) assert.deepEqual(aboutSectionSchema.parse({ ...imageSection, images: value }), { _type: imageSection._type, _key: imageSection._key, images: [] });
  for (const value of [[...images, { ...images[0], _key: "nineteenth" }], [images[0], images[0]], [{ ...images[0], alt: " " }], [{ ...images[0], width: 0 }], [{ ...images[0], height: 20001 }], [{ ...images[0], src: "https://example.com/private.png" }]]) assert.equal(aboutSectionSchema.safeParse({ ...imageSection, images: value }).success, false);
  const parsed = aboutSectionSchema.parse({ ...imageSection, images: [{ ...images[0], crop: { top: .1 }, hotspot: { x: .1 } }] });
  assert.equal(parsed._type, "aboutImageCarousel");
  if (parsed._type === "aboutImageCarousel") assert.deepEqual(parsed.images[0], images[0]);
});

test("skill tree validates count, names, badge details, missing parents and cycles without requiring a progression", () => {
  for (const nodes of [undefined, null, [], [node("root")], tree.nodes, Array.from({ length: 20 }, (_, i) => ({ ...node(`node-${i}`), tier: Math.floor(i / 5) + 1 }))]) assert.equal(aboutSkillTreeSchema.safeParse({ ...tree, nodes }).success, true);
  for (const nodes of [Array.from({ length: 21 }, (_, i) => ({ ...node(`node-${i}`), tier: Math.floor(i / 5) + 1 })), [node("duplicate"), node("duplicate")], [node("child", "missing")], [node("self", "self")], [node("a", "b"), node("b", "a")], [node("a", "c"), node("b", "a"), node("c", "b")], [{ ...node("name"), name: "x".repeat(skillTreeLimits.name + 1) }], [{ ...node("alt"), badge: { ...image, alt: " " } }], [{ ...node("empty"), body: [] }], [{ ...node("unsafe"), body: [{ ...paragraph("Unsafe"), markDefs: [{ _type: "link", _key: "bad", href: "javascript:alert(1)" }] }] }]]) assert.equal(aboutSkillTreeSchema.safeParse({ ...tree, nodes }).success, false);
  assert.equal(aboutSectionSchema.safeParse({ ...skillSection, trees: Array.from({ length: 8 }, (_, i) => ({ ...tree, _key: `tree-${i}` })) }).success, true);
  assert.equal(aboutSectionSchema.safeParse({ ...skillSection, trees: Array.from({ length: 9 }, (_, i) => ({ ...tree, _key: `tree-${i}` })) }).success, false);
  assert.equal(aboutSectionSchema.safeParse({ ...skillSection, trees: [tree, tree] }).success, false);
});

test("tree layout keeps foundations above descendants at all column counts, with stable order and connectors", () => {
  const input = [{ ...node("advanced", "middle"), tier: 3 }, node("root-a"), node("middle", "root-a"), node("root-b"), node("root-c"), node("root-d")];
  const original = structuredClone(input);
  for (const columns of [1, 2, 3]) {
    const layout = skillTreeLayout(input, columns);
    assert.equal(layout.columns, columns);
    assert.deepEqual(layout.positions.slice(0, 4).map((position) => position.key), ["root-a", "root-b", "root-c", "root-d"]);
    const positions = new Map(layout.positions.map((position) => [position.key, position]));
    for (const item of input.filter((item) => item.prerequisite)) assert.ok(positions.get(item._key)!.row > positions.get(item.prerequisite!)!.row);
    assert.equal(layout.connections.length, 2);
    assert.ok(layout.connections.every((path) => /^M \d+ \d+ V \d+ H \d+ V \d+ H \d+ V \d+$/.test(path)));
    assert.equal(new Set(layout.positions.map((position) => `${position.row}:${position.column}`)).size, input.length);
  }
  assert.deepEqual(input, original);
  assert.equal(skillTreeLayout([], 3).rows, 0);
  assert.equal(skillTreeLayout([node("bad", "missing")], 3).positions.length, 0);
});

test("four editable tiers retain variable 5 / 4 / 5 / 3 counts and optional relationships, with five as the tier limit", async () => {
  const counts = [5, 4, 5, 3];
  const nodes = counts.flatMap((count, tier) => Array.from({ length: count }, (_, index) => ({ ...node(`tier-${tier + 1}-${index}`), tier: tier + 1, prerequisite: tier > 0 && index === 0 ? `tier-${tier}-0` : undefined })));
  const sample = { ...tree, nodes };
  assert.equal(aboutSkillTreeSchema.safeParse(sample).success, true);
  const native = await nativeValidate([{ ...skillSection, trees: [{ ...sample, nodes: nodes.map((node) => ({ ...node, badge: nativeImage })) }] }]);
  assert.equal(native.status, "passed", JSON.stringify(native.markers));
  const layout = skillTreeLayout(nodes, 5);
  assert.equal(layout.columns, 5);
  assert.equal(layout.rows, 4);
  assert.deepEqual([0, 1, 2, 3].map((row) => layout.positions.filter((node) => node.row === row).length), counts);
  assert.equal(layout.connections.length, 3, "Only explicitly authored prerequisites draw connections");
  assert.equal(aboutSkillTreeSchema.safeParse({ ...sample, nodes: [...nodes, { ...node("sixth"), tier: 1 }] }).success, false);
  assert.equal(aboutSkillTreeSchema.safeParse({ ...sample, nodes: [{ ...nodes[0], prerequisite: nodes.at(-1)!._key }, ...nodes.slice(1)] }).success, false);
  for (const tier of [0, 5, 1.5, "2"]) assert.equal(aboutSkillTreeSchema.safeParse({ ...sample, nodes: [{ ...nodes[0], tier }, ...nodes.slice(1)] }).success, false);
});

test("native and actual published GROQ resolve carousel, badge and rich-body assets while preserving other content", async () => {
  const raw = { ...seedAbout, _id: "about", _type: "about", sections: nativeSections };
  const original = structuredClone(raw);
  const native = aboutSchema.parse(nativeAboutData(raw, config));
  const groq = createRequire(createRequire(import.meta.url).resolve("sanity/package.json"))("groq-js");
  const asset = { _id: nativeImage.asset._ref, _type: "sanity.imageAsset", url: image.src, metadata: { dimensions: { width: image.width, height: image.height } } };
  const assetNode = { ...nativeTree.nodes[0], ranks: { ...nativeTree.nodes[0].ranks, rank2: [{ ...nativeImage, _key: "rank-image", caption: "Rank image" }] }, body: [paragraph("Strong text"), { ...nativeImage, _key: "body-image", caption: "Body image" }] };
  const sectionWithAssetBody = { ...nativeSections[1], trees: [{ ...nativeTree, nodes: [assetNode, ...nativeTree.nodes.slice(1)] }] };
  const dataset = [asset, { ...raw, sections: [nativeSections[0], sectionWithAssetBody] }, { ...raw, _id: "drafts.about", title: "PRIVATE DRAFT" }, { ...raw, _id: "versions.release.about", title: "PRIVATE RELEASE" }, { ...seedCases[0], _id: "case-test", _type: "post", kind: "caseStudy" }, { ...seedArticles[0], _id: "post-test", _type: "post", kind: "article" }];
  const result = await (await groq.evaluate(groq.parse(publishedQuery), { dataset })).get();
  const content = decodePublishedContent(result);
  const expected = aboutSchema.parse(nativeAboutData({ ...raw, sections: [nativeSections[0], sectionWithAssetBody] }, config));
  assert.deepEqual(content.about, { ...expected, sections: expected.sections!.map((section) => ({ ...section, body: null })) });
  assert.deepEqual(content.about?.gallery, seedAbout.gallery);
  assert.deepEqual(content.cases[0].sections, seedCases[0].sections);
  assert.deepEqual(content.articles[0].body, seedArticles[0].body);
  assert.ok(!JSON.stringify(result).includes("PRIVATE"));
  assert.deepEqual(raw, original);
  assert.deepEqual(native.sections?.map((item) => item._key), ["images", "skills"]);
  for (const sections of [undefined, [], [{ ...skillSection, trees: [{ _type: "aboutSkillTree", _key: "empty", title: "Empty" }] }]]) {
    const doc = { ...seedAbout, _id: "about", _type: "about", ...(sections === undefined ? {} : { sections }) };
    const projected = await (await groq.evaluate(groq.parse(publishedQuery), { dataset: [doc] })).get();
    assert.deepEqual(decodePublishedContent(projected).about?.sections, aboutSchema.parse(doc).sections?.map((section) => ({ ...section, body: null })));
  }
});

test("actual Studio schemas expose sortable native editors, editable default heading and actionable relationship validation", async () => {
  const valid = await nativeValidate(nativeSections);
  assert.equal(valid.status, "passed", JSON.stringify(valid.markers));
  for (const section of [{ ...nativeSections[0], images: [] }, { _type: "aboutImageCarousel", _key: "unset" }, { ...skillSection, trees: [{ _type: "aboutSkillTree", _key: "empty", title: "Empty" }] }]) assert.equal((await nativeValidate([section])).status, "passed");
  for (const section of [{ ...nativeSections[0], images: [{ ...nativeImage, _key: "bad-alt", alt: " " }] }, { ...skillSection, trees: [{ ...nativeTree, nodes: [{ ...nativeTree.nodes[0], prerequisite: "missing" }] }] }, { ...skillSection, trees: [{ ...nativeTree, nodes: [{ ...nativeTree.nodes[0], prerequisite: "advanced" }] }] }, { ...skillSection, trees: [{ ...nativeTree, nodes: [{ ...nativeTree.nodes[0], body: [] }] }] }]) assert.equal((await nativeValidate([section])).status, "failed");
  for (const name of ["aboutImageCarousel", "aboutSkillsCarousel", "aboutSkillTree"]) {
    const type = compiled.get(name) as { fields: { name: string; type: { options?: { sortable?: boolean }; of?: { name: string }[] } }[] };
    const list = type.fields.find((field) => ["images", "trees", "nodes"].includes(field.name))!;
    assert.equal(list.type.options?.sortable, true);
  }
  const skills = schemaTypes.find((type) => type.name === "aboutSkillsCarousel")!;
  assert.deepEqual(skills.initialValue, { headline: "My skills" });
  const nativeNode = compiled.get("aboutSkillNode") as { fields: { name: string; type: { options?: { list?: unknown[] }; of?: { name: string; components?: unknown }[] } }[] };
  assert.equal(nativeNode.fields.find((field) => field.name === "prerequisite")!.type.options?.list, undefined, "Dynamic relationship keys must not be restricted by a static allowed-value list");
  assert.deepEqual(nativeNode.fields.find((field) => field.name === "body")!.type.of!.map((type) => type.name), ["image", "block"]);
});

test("rank descriptions and authored state are independent from tree tier, with no inferred current rank", async () => {
  const locked = { ...node("locked-skill"), tier: 3, status: "locked" as const, currentRank: 1 };
  const authored = { ...tree, headerColor: "rose" as const, nodes: [locked, { ...node("open-skill"), status: "unlocked" as const }] };
  assert.equal(aboutSkillTreeSchema.safeParse(authored).success, true);
  const result = await nativeValidate([{ ...skillSection, trees: [{ ...authored, nodes: authored.nodes.map((node) => ({ ...node, badge: nativeImage })) }] }]);
  assert.equal(result.status, "passed", JSON.stringify(result.markers));
  for (const change of [{ status: undefined }, { status: "mastered" }, { currentRank: 0 }, { currentRank: 5 }, { ranks: { ...locked.ranks, rank3: [] } }, { ranks: undefined }]) {
    assert.equal(aboutSkillTreeSchema.safeParse({ ...authored, nodes: [{ ...locked, ...change }] }).success, false);
    assert.equal((await nativeValidate([{ ...skillSection, trees: [{ ...authored, nodes: [{ ...locked, badge: nativeImage, ...change }] }] }])).status, "failed");
  }
  assert.equal(aboutSkillTreeSchema.safeParse({ ...authored, headerColor: "#123abc" }).success, false);
  const html = renderToStaticMarkup(createElement(AboutSkillsCarousel, { trees: [authored], label: "Authored skills" }));
  assert.match(html, /data-color="rose"/);
  assert.match(html, /Current rank: 1/);
  assert.match(html, /locked-skill · Tier 3 · Locked/);
  for (const rank of [1, 2, 3, 4]) assert.ok(html.includes(`Rank ${rank} for locked-skill`));
  const unset = renderToStaticMarkup(createElement(AboutSkillsCarousel, { trees: [{ ...authored, nodes: [node("no-rank")] }], label: "No rank claim" }));
  assert.doesNotMatch(unset, /Current rank/);
  for (let count = 1; count <= 5; count++) {
    const nodes = [1, 2, 3, 4].flatMap((tier) => Array.from({ length: count }, (_, index) => ({ ...node(`tier-${tier}-${index}`), tier })));
    assert.equal(aboutSkillTreeSchema.safeParse({ ...tree, nodes }).success, true);
  }
  let renderer!: ReactTestRenderer;
  try {
    await act(async () => { renderer = create(createElement(AboutSkillsCarousel, { trees: [authored], label: "Authored skills" })); });
    const badges = () => renderer.root.findAllByType("button").filter((button) => button.props["aria-pressed"] !== undefined);
    const lockedButton = badges().find((button) => button.props["data-state"] === "locked")!;
    assert.equal(lockedButton.props.disabled, undefined);
    await act(async () => { lockedButton.props.onClick(); });
    assert.equal(renderer.root.findByType("section").findByType("h3").children.join(""), "locked-skill");
    assert.equal(renderer.root.findByType("section").findAllByType("h4").length, 4);
    await act(async () => { badges().find((button) => button.props["data-state"] === "unlocked")!.props.onClick(); });
    assert.equal(renderer.root.findByType("section").findByType("h3").children.join(""), "open-skill");
    assert.equal(renderer.root.findByType("section").findAllByProps({ className: "about-skill-tree__state" })[0].children.join(""), "Unlocked");
  } finally { await act(async () => { renderer?.unmount(); }); }
});

test("prerequisite input uses native keyed context, earlier-tier named choices and field-scoped patches with recovery", async () => {
  const patches: unknown[] = [];
  const props = { path: ["sections", { _key: "skills" }, "trees", { _key: "tree" }, "nodes", { _key: "advanced" }, "prerequisite"], schemaType: { name: "string", type: "string" }, elementProps: { id: "prerequisite", onFocus: () => {} }, onChange: (patch: unknown) => patches.push(patch) } as unknown as StringInputProps;
  let renderer!: ReactTestRenderer;
  const renderInput = (value: Record<string, unknown>, inputProps = props) => createElement(FormValueProvider, { value: { _id: "drafts.about", _type: "about", ...value } } as ComponentProps<typeof FormValueProvider>, createElement(SkillPrerequisiteInput, inputProps));
  try {
    await act(async () => { renderer = create(renderInput({ sections: [skillSection] })); });
    const select = () => renderer.root.findByType("select");
    assert.deepEqual(select().findAllByType("option").map((option) => option.props.value), ["", "foundation", "second"], "Self and same/later tiers cannot become parents");
    assert.equal(select().findAllByType("option")[1].children.join(""), "foundation");
    assert.equal(select().props.id, props.elementProps.id);
    assert.equal(select().props.onFocus, props.elementProps.onFocus);
    await act(async () => { select().props.onChange({ currentTarget: { value: "second" } }); });
    assert.equal((patches[0] as { type: string; value: string }).type, "set");
    assert.equal((patches[0] as { value: string }).value, "second");
    assert.deepEqual((patches[0] as { path: unknown[] }).path, []);
    await act(async () => { select().props.onChange({ currentTarget: { value: "" } }); });
    assert.equal((patches[1] as { type: string }).type, "unset");
    const invalidTree = { ...tree, nodes: [...tree.nodes, { ...node("unrelated", "missing"), tier: 3 }] };
    await act(async () => { renderer.update(renderInput({ sections: [{ ...skillSection, trees: [invalidTree] }] })); });
    assert.deepEqual(select().findAllByType("option").map((option) => option.props.value), ["", "foundation", "second"], "An unrelated invalid draft does not hide safe recovery choices");
    await act(async () => { renderer.update(renderInput({ sections: [skillSection] }, { ...props, value: "removed", readOnly: true })); });
    assert.equal(select().findAllByType("option").at(-1)!.children.join(""), "Unavailable prerequisite; choose another");
    assert.equal(select().props.disabled, true);
  } finally { await act(async () => { renderer?.unmount(); }); }
});

test("server output keeps full images and all skill details available without JavaScript, and hides empty sections", () => {
  const parsed = aboutSchema.parse({ ...seedAbout, sections: [imageSection, skillSection] });
  const html = renderToStaticMarkup(createElement(AboutSections, { sections: parsed.sections! }));
  assert.equal((html.match(/about-section-divider/g) ?? []).length, 2);
  assert.match(html, /<h2>My skills<\/h2>/);
  assert.match(html, /width="2400" height="1350"/);
  assert.match(html, /href="https:\/\/cdn.sanity.io\/images\/validation\/portfolio\/test-2400x1350.webp"/);
  assert.match(html, /A &lt;caption&gt;/);
  assert.equal((html.match(/<details>/g) ?? []).length, tree.nodes.length);
  for (const item of tree.nodes) assert.ok(html.includes(`Details for ${item.name}`));
  assert.match(html, /Builds on foundation/);
  assert.doesNotMatch(html, /aria-label="Next slide"|aria-label="Next skill tree"|fit=crop|rect=|fp-x/);
  for (const sections of [[{ ...imageSection, images: [] }], [{ ...skillSection, trees: [] }], [{ ...skillSection, trees: [{ ...tree, nodes: [] }] }]]) {
    const empty = renderToStaticMarkup(createElement(AboutSections, { sections }));
    assert.equal(empty, "");
  }
  const hero = (sections: unknown[]) => renderToStaticMarkup(createElement(AboutView, { about: aboutSchema.parse({ ...seedAbout, sections }), cases: [], articles: [] })).match(/<section class="info-page about-page"[\s\S]*?<\/section>/)?.[0];
  assert.equal(hero([]), hero([imageSection, skillSection]));
});

function installGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value });
  return () => { if (previous) Object.defineProperty(globalThis, name, previous); else Reflect.deleteProperty(globalThis, name); };
}
const keyEvent = (key: string, target: unknown, currentTarget = target, extra = {}) => { let prevented = false; return { event: { key, target, currentTarget, preventDefault() { prevented = true; }, ...extra }, prevented: () => prevented }; };

test("image carousel actual handlers bound manual navigation, sync scrolling/focus and preserve selected identity on reorder/removal", async () => {
  let order = images.slice(0, 3);
  const moves: { left: number; top: number; behavior: string }[] = [];
  const viewport = { scrollLeft: 0, scrollTop: 75, clientWidth: 400, clientHeight: 1000, offsetHeight: 1017, style: { height: "" }, scrollTo(value: { left: number; top: number; behavior: string }) { this.scrollLeft = value.left; this.scrollTop = value.top; moves.push(value); } };
  const observers: (() => void)[] = []; let disconnected = 0;
  const restoreResize = installGlobal("ResizeObserver", class { constructor(callback: () => void) { observers.push(callback); } observe() {} disconnect() { disconnected++; } });
  let renderer!: ReactTestRenderer;
  const renderCarousel = () => createElement(AboutImageCarousel, { items: order, label: "Fixture carousel" });
  const slideStatus = () => renderer.root.findByProps({ className: "about-carousel__controls" }).findByType("p").children.join("");
  const button = (label: string) => renderer.root.findByProps({ "aria-label": label });
  const keyboard = async (key: string, target: unknown = viewport, modifiers = {}) => { const event = keyEvent(key, target, viewport, modifiers); await act(async () => { renderer.root.findByType("ul").props.onKeyDown(event.event); }); return event.prevented(); };
  try {
    await act(async () => { renderer = create(renderCarousel(), { createNodeMock(element) {
      if (element.type === "ul") return viewport;
      if (element.type === "dialog") return {};
      if (element.type === "li") { const index = Number((element.props as { "aria-label": string })["aria-label"].split(" ")[0]) - 1; const key = order[index]._key; return { get offsetHeight() { return key === images[1]._key ? 700 : 300; }, get offsetLeft() { return 8 + order.findIndex((item) => item._key === key) * 400; }, contains(target: { key?: string }) { return target.key === key; } }; }
      return null;
    } }); });
    assert.equal(slideStatus(), "Image 1 of 3");
    assert.equal(viewport.style.height, "333px", "Classic horizontal scrollbar leaves the full active content visible");
    assert.equal(button("Previous slide").props["aria-disabled"], true);
    assert.equal(await keyboard("End"), true);
    assert.equal(viewport.scrollLeft, 800);
    assert.equal(viewport.scrollTop, 0);
    assert.equal(slideStatus(), "Image 3 of 3");
    await act(async () => { button("Next slide").props.onClick(); });
    assert.equal(slideStatus(), "Image 3 of 3");
    assert.equal(await keyboard("ArrowLeft"), true);
    assert.equal(slideStatus(), "Image 2 of 3");
    assert.equal(viewport.style.height, "733px", "Active caption/image height determines viewport, not a taller inactive slide");
    assert.equal(await keyboard("ArrowRight", {}, { metaKey: true }), false);
    assert.equal(await keyboard("ArrowRight", { badge: true }), false);
    viewport.scrollLeft = 790;
    await act(async () => { renderer.root.findByType("ul").props.onScroll(); });
    assert.equal(slideStatus(), "Image 3 of 3");
    await act(async () => { renderer.root.findByType("ul").props.onFocusCapture({ target: { key: images[0]._key } }); });
    assert.equal(slideStatus(), "Image 1 of 3");
    await keyboard("ArrowRight");
    order = [images[1], images[0], images[2]];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(slideStatus(), "Image 1 of 3", "Same selected image moves to its new index");
    assert.equal(viewport.scrollLeft, 0);
    viewport.scrollLeft = 41;
    viewport.clientWidth = 500;
    await act(async () => { observers.forEach((callback) => callback()); });
    assert.equal(viewport.scrollLeft, 0);
    order = [images[0]];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(slideStatus(), "Image 1 of 1");
    assert.equal(renderer.root.findAllByType("button").length, 0);
    assert.ok(moves.every((move) => move.behavior === "instant"));
    order = [];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(renderer.toJSON(), null);
  } finally { await act(async () => { renderer?.unmount(); }); restoreResize(); }
  assert.ok(disconnected > 0);
});

test("carousel viewer preserves full-size link, focus, modal identity and cleanup through reorder and removal", async () => {
  const doc = { body: { style: { overflow: "scroll" } }, activeElement: null as unknown };
  const restoreDocument = installGlobal("document", doc);
  const controls = new Map<string, { focus(): void }>();
  let opens = 0, closes = 0, restored = 0;
  const dialog = { open: false, showModal() { this.open = true; opens++; }, close() { this.open = false; closes++; } };
  const opener = { focus() { restored++; doc.activeElement = this; } };
  let renderer!: ReactTestRenderer;
  let order = images.slice(0, 2);
  const renderCarousel = () => createElement(AboutImageCarousel, { items: order, label: "Fixture carousel" });
  const imageLink = () => renderer.root.findAllByType("a").find((link) => link.props["aria-haspopup"] === "dialog")!;
  const click = async (extra = {}) => { let prevented = false; await act(async () => { imageLink().props.onClick({ button: 0, currentTarget: opener, preventDefault() { prevented = true; }, ...extra }); }); return prevented; };
  try {
    await act(async () => { renderer = create(renderCarousel(), { createNodeMock(element) {
      if (element.type === "dialog") return dialog;
      if (element.type === "button" || element.type === "a") { const control = { focus() { doc.activeElement = this; } }; const props = element.props as { "aria-label": string; className: string }; controls.set(props["aria-label"] || props.className, control); return control; }
      return null;
    } }); });
    for (const modifier of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) assert.equal(await click(modifier), false);
    assert.equal(await click(), true);
    assert.equal(dialog.open, true);
    assert.equal(doc.body.style.overflow, "hidden");
    const full = renderer.root.findByProps({ className: "about-image-viewer__original" });
    assert.equal(full.props.href, order[0].src);
    assert.equal(doc.activeElement, controls.get("Close image viewer"));
    doc.activeElement = controls.get("Next image");
    const tab = keyEvent("Tab", dialog);
    await act(async () => { renderer.root.findByType("dialog").props.onKeyDown(tab.event); });
    assert.equal(tab.prevented(), true);
    assert.equal(doc.activeElement, controls.get("Close image viewer"));
    order = [images[1], images[0]];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(renderer.root.findByType("dialog").findByProps({ role: "status" }).children.join(""), "Image 2 of 2");
    assert.equal(opens, 1);
    order = [images[1]];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(dialog.open, false);
    assert.equal(doc.body.style.overflow, "scroll");
    assert.equal(restored, 1);
    await click();
    const escape = keyEvent("Escape", dialog);
    await act(async () => { renderer.root.findByType("dialog").props.onKeyDown(escape.event); });
    assert.equal(escape.prevented(), true);
    assert.equal(restored, 2);
    await click();
  } finally { await act(async () => { renderer?.unmount(); }); restoreDocument(); }
  assert.equal(doc.body.style.overflow, "scroll");
  assert.equal(opens, closes);
});

test("skills actual handlers reveal advanced nodes freely, maintain independent tree navigation and support keyboard at every breakpoint", async () => {
  let width = 1440;
  const panels: string[] = [];
  const restoreWindow = installGlobal("window", { scrollY: 0, scrollTo(options: { behavior: string }) { panels.push(options.behavior); }, matchMedia(query: string) { return { matches: width <= (query.includes("360") ? 360 : 800) }; } });
  const focused: string[] = [];
  let renderer!: ReactTestRenderer;
  const second: AboutSkillTree = { ...tree, _key: "another", title: "Another category", nodes: [node("another-root")] };
  let trees = [tree, second];
  const renderCarousel = () => createElement(AboutSkillsCarousel, { trees, label: "My skills" });
  const badge = (name: string) => renderer.root.findAllByType("button").find((button) => button.findAllByType("span").some((span) => span.children.join("") === name))!;
  const selected = () => renderer.root.findAllByType("section")[0].findByType("h3").children.join("");
  const keyboard = async (name: string, key: string) => { const event = keyEvent(key, {}); await act(async () => { badge(name).props.onKeyDown(event.event); }); return event.prevented(); };
  try {
    await act(async () => { renderer = create(renderCarousel(), { createNodeMock(element) { if (element.type === "section") return { focus() { panels.push("focus"); }, getBoundingClientRect() { return { top: 1000 }; } }; const props = element.props as { "aria-controls": string; "aria-pressed": boolean; children: { props: { children: string } }[] }; if (element.type === "button" && props["aria-controls"] && props["aria-pressed"] !== undefined) { const name = props.children[1].props.children; return { focus() { focused.push(name); }, getBoundingClientRect() { return { top: 1000 }; } }; } return null; } }); });
    assert.equal(selected(), "advanced");
    assert.match(renderer.root.findAllByType("section")[0].findAllByType("p").map((p) => p.children.join("")).join(" "), /Builds on foundation/);
    assert.equal(badge("advanced").props["aria-pressed"], true);
    assert.equal(badge("advanced").props["aria-controls"], renderer.root.findAllByType("section")[0].props.id);
    await act(async () => { badge("middle").props.onClick(); });
    assert.equal(selected(), "middle");
    assert.deepEqual(panels, ["focus", "instant"]);
    await act(async () => { renderer.root.findAllByProps({ className: "about-skill-tree__back" })[0].props.onClick(); });
    assert.equal(focused.at(-1), "middle");
    assert.equal(panels.at(-1), "instant");
    assert.equal(await keyboard("middle", "Home"), true);
    assert.equal(selected(), "foundation");
    assert.equal(await keyboard("foundation", "ArrowRight"), true);
    assert.equal(selected(), "second");
    assert.equal(await keyboard("second", "End"), true);
    assert.equal(selected(), "middle");
    width = 390;
    await keyboard("foundation", "ArrowDown");
    assert.equal(selected(), "advanced");
    width = 320;
    await keyboard("foundation", "ArrowDown");
    assert.equal(selected(), "second");
    await keyboard("second", "ArrowUp");
    assert.equal(selected(), "foundation");
    const statuses = () => renderer.root.findByProps({ className: "about-carousel__controls" }).findByType("p").children.join("");
    await act(async () => { renderer.root.findByProps({ "aria-label": "Next skill tree" }).props.onClick(); });
    assert.equal(statuses(), "Another category, 2 of 2");
    await act(async () => { renderer.root.findByProps({ "aria-label": "Next skill tree" }).props.onClick(); });
    assert.equal(statuses(), "Another category, 2 of 2");
    trees = [second, { ...tree, nodes: tree.nodes.filter((node) => node._key !== "foundation").map((node) => ({ ...node, prerequisite: undefined })) }];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(statuses(), "Another category, 1 of 2");
    assert.equal(renderer.root.findAllByType("section")[1].findByType("h3").children.join(""), "advanced", "Deleted badge falls back to first node");
    trees = [{ ...tree, nodes: [] }];
    await act(async () => { renderer.update(renderCarousel()); });
    assert.equal(renderer.toJSON(), null);
    assert.ok(focused.includes("foundation") && focused.includes("advanced"));
  } finally { await act(async () => { renderer?.unmount(); }); restoreWindow(); }
});
