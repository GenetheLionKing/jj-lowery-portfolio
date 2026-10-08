import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { createClient } from "@sanity/client";
import { createSchema } from "sanity";
import { AboutImageGallery } from "../components/about-gallery";
import { AboutView } from "../components/about-view";
import { aboutSchema, type AboutGalleryImage } from "../content/model";
import { nativeAboutData } from "../content/native-about";
import { decodePublishedContent, publishedQuery } from "../content/read";
import { seedAbout, seedArticles } from "../content/seed";
import { schemaTypes } from "../studio/schema";

const config = { projectId: "validation", dataset: "portfolio" };
const images: AboutGalleryImage[] = Array.from({ length: 6 }, (_, index) => ({
  _key: `image-${index}`,
  src: "/images/profile-shoulder-640.webp",
  alt: `Fixture image ${index + 1}`,
  width: 1640,
  height: 1294,
  ...(index === 0 ? { caption: "A <caption> with literal characters" } : {}),
}));
const nativeImages = images.map((image) => ({
  _key: image._key,
  alt: image.alt,
  caption: image.caption,
  _type: "image",
  asset: { _type: "reference", _ref: "image-test-1640x1294-webp" },
}));

test("About owns zero to six ordered images; native and published reads preserve alt, captions and keys", () => {
  for (let count = 0; count <= 6; count++) {
    const raw = {
      ...seedAbout,
      gallery: nativeImages.slice(0, count).reverse(),
    };
    const original = structuredClone(raw);
    const native = aboutSchema.parse(nativeAboutData(raw, config));
    const decoded = decodePublishedContent([
      { ...native, _id: "about", _type: "about" },
    ]).about!;
    assert.deepEqual(decoded.gallery, native.gallery);
    assert.deepEqual(
      decoded.gallery.map((image) => image._key),
      raw.gallery.map((image) => image._key),
    );
    assert.deepEqual(raw, original);
  }
  assert.match(publishedQuery, /_type == "about" && defined\(gallery\)/);
  assert.match(publishedQuery, /"gallery": gallery\[\]\{.*defined\(asset\)/);
  for (const gallery of [undefined, null, []]) {
    assert.deepEqual(
      aboutSchema.parse(nativeAboutData({ ...seedAbout, gallery }, config))
        .gallery,
      [],
    );
    assert.deepEqual(
      decodePublishedContent([
        { ...seedAbout, gallery, _id: "about", _type: "about" },
      ]).about!.gallery,
      [],
    );
  }
  for (const gallery of [
    [...images, { ...images[0], _key: "seventh" }],
    [images[0], images[0]],
    [{ ...images[0], alt: "   " }],
    [{ ...images[0], src: "https://example.com/private.png" }],
    [{ ...images[0], width: 20001 }],
  ])
    assert.equal(
      aboutSchema.safeParse({ ...seedAbout, gallery }).success,
      false,
    );
});

test("missing/empty About gallery never resurrects Post thumbnails; independent story link retains its target", () => {
  const tagged = {
    ...seedArticles[0],
    mainImage: images[0],
    tags: ["about-gallery", "blog"],
  };
  const render = (gallery?: AboutGalleryImage[]) =>
    renderToStaticMarkup(
      createElement(AboutView, {
        about: aboutSchema.parse({
          ...seedAbout,
          gallery,
          story: ["Existing story text"],
        }),
        cases: [],
        articles: [tagged],
        storyHref: "/blog/my-story/",
      }),
    );
  for (const gallery of [undefined, []]) {
    const html = render(gallery);
    assert.doesNotMatch(html, /About images|Enlarge image|Personal stories/);
    assert.match(html, /href="\/blog\/my-story\/?"/);
  }
  const html = render(images);
  assert.equal((html.match(/aria-label="Enlarge image:/g) ?? []).length, 6);
  assert.match(html, /href="\/blog\/my-story\/?"/);
  assert.ok(!html.includes(tagged.title));
  assert.ok(
    html.indexOf('class="profile-figure"') <
      html.indexOf('aria-label="About images"'),
  );
  assert.ok(
    html.includes('href="/images/profile-shoulder-640.webp"'),
    "No-JS links point to full images, never Posts",
  );
  assert.doesNotMatch(html, /<dialog[^>]*\sopen(?:\s|>)/);
});

test("native About schema validates one to six images, duplicate assets with distinct keys and empty/unset galleries", async () => {
  const nativeRequire = createRequire(
    createRequire(import.meta.url).resolve("sanity"),
  );
  const { validateDocument } = nativeRequire("@sanity/validation");
  const schema = createSchema({
    name: "about-gallery-native",
    types: schemaTypes,
  });
  const validate = (gallery?: unknown) =>
    validateDocument({
      document: { ...seedAbout, _id: "drafts.about", _type: "about", gallery },
      schema,
      client: createClient({
        ...config,
        apiVersion: "2026-10-01",
        useCdn: false,
        requestHandler: async () => {
          throw Error("Local validation must not call a CMS");
        },
      }),
      customValidation: true,
      getDocumentExists: async () => true,
    });
  for (const gallery of [
    undefined,
    [],
    ...Array.from({ length: 6 }, (_, index) =>
      nativeImages.slice(0, index + 1),
    ),
  ]) {
    const result = await validate(gallery);
    assert.equal(result.status, "passed", JSON.stringify(result.markers));
    assert.deepEqual(result.markers, []);
  }
  for (const gallery of [
    [...nativeImages, { ...nativeImages[0], _key: "seventh" }],
    [{ ...nativeImages[0], alt: "   " }],
    [{ ...nativeImages[0], asset: { _ref: "image-test-1640x1294-svg" } }],
    [nativeImages[0], nativeImages[0]],
  ])
    assert.equal((await validate(gallery)).status, "failed");
  const about = schemaTypes.find((type) => type.name === "about")!;
  const gallery = about.fields!.find((field) => field.name === "gallery")!;
  assert.equal(gallery.type, "array");
  assert.deepEqual("options" in gallery ? gallery.options : undefined, {
    layout: "grid",
    sortable: true,
  });
});

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("gallery's actual handlers open, navigate, trap keyboard focus, close and restore the exact opener without a browser", async () => {
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  const documentModel: {
    body: { style: { overflow: string } };
    activeElement: unknown;
  } = {
    body: { style: { overflow: "auto" } },
    activeElement: null,
  };
  Object.defineProperty(globalThis, "document", {
    value: documentModel,
    configurable: true,
  });
  const controls = new Map<string, { focus: () => void }>();
  let modalOpens = 0,
    modalCloses = 0;
  const restored: number[] = [];
  const dialog = {
    open: false,
    showModal() {
      this.open = true;
      modalOpens++;
    },
    close() {
      this.open = false;
      modalCloses++;
    },
  };
  const openers = images.map((_, index) => ({
    focus() {
      documentModel.activeElement = this;
      restored.push(index);
    },
  }));
  let renderer!: ReactTestRenderer;
  const clickImage = async (index: number, modifiers = {}) => {
    let prevented = false;
    await act(async () => {
      renderer.root.findAllByType("a")[index].props.onClick({
        button: 0,
        currentTarget: openers[index],
        preventDefault: () => {
          prevented = true;
        },
        ...modifiers,
      });
    });
    return prevented;
  };
  const key = async (key: string, shiftKey = false) => {
    let prevented = false;
    await act(async () => {
      renderer.root.findByType("dialog").props.onKeyDown({
        key,
        shiftKey,
        preventDefault: () => {
          prevented = true;
        },
      });
    });
    return prevented;
  };
  const button = (label: string) =>
    renderer.root.findByProps({ "aria-label": label });
  try {
    await act(async () => {
      renderer = create(createElement(AboutImageGallery, { items: images }), {
        createNodeMock: (element) => {
          if (element.type === "dialog") return dialog;
          if (element.type === "button") {
            const control = {
              focus() {
                documentModel.activeElement = this;
              },
            };
            controls.set(
              (element.props as { "aria-label": string })["aria-label"],
              control,
            );
            return control;
          }
          return null;
        },
      });
    });
    assert.equal(await clickImage(0, { metaKey: true }), false);
    assert.equal(
      modalOpens,
      0,
      "Modified clicks retain the image URL's normal behavior",
    );
    assert.equal(await clickImage(0), true);
    assert.equal(dialog.open, true);
    assert.equal(documentModel.body.style.overflow, "hidden");
    assert.equal(
      documentModel.activeElement,
      controls.get("Close image viewer"),
    );
    assert.equal(
      renderer.root.findByType("figcaption").children.join(""),
      images[0].caption,
    );
    assert.equal(
      renderer.root.findByType("dialog").props["aria-describedby"],
      renderer.root.findByType("figcaption").props.id,
    );
    documentModel.activeElement = controls.get("Next image");
    assert.equal(await key("Tab"), true);
    assert.equal(
      documentModel.activeElement,
      controls.get("Close image viewer"),
    );
    assert.equal(await key("Tab", true), true);
    assert.equal(documentModel.activeElement, controls.get("Next image"));
    await act(async () => {
      button("Next image").props.onClick();
    });
    assert.equal(
      renderer.root.findByProps({ role: "status" }).children.join(""),
      "Image 2 of 6",
    );
    assert.equal(
      renderer.root.findAllByType("img").at(-1)!.props.alt,
      images[1].alt,
    );
    assert.equal(
      renderer.root.findByType("dialog").props["aria-describedby"],
      undefined,
    );
    assert.equal(
      modalOpens,
      1,
      "Navigation keeps the existing modal and focus context",
    );
    await key("ArrowLeft");
    await act(async () => {
      button("Previous image").props.onClick();
    });
    assert.equal(
      renderer.root.findByProps({ role: "status" }).children.join(""),
      "Image 6 of 6",
    );
    await key("ArrowRight");
    assert.equal(await key("Escape"), true);
    assert.equal(dialog.open, false);
    assert.equal(documentModel.body.style.overflow, "auto");
    assert.deepEqual(restored, [0]);
    await clickImage(3);
    await act(async () => {
      button("Close image viewer").props.onClick();
    });
    assert.deepEqual(restored, [0, 3]);
    await clickImage(2);
    let cancelPrevented = false;
    await act(async () => {
      renderer.root.findByType("dialog").props.onCancel({
        preventDefault() {
          cancelPrevented = true;
        },
      });
    });
    assert.equal(cancelPrevented, true);
    assert.deepEqual(restored, [0, 3, 2]);
    await act(async () => {
      renderer.update(
        createElement(AboutImageGallery, { items: images.slice(0, 1) }),
      );
    });
    await clickImage(0);
    assert.equal(
      renderer.root.findAllByProps({ "aria-label": "Image navigation" }).length,
      0,
    );
    assert.equal(await key("Tab"), true);
    await act(async () => {
      renderer.unmount();
    });
    assert.equal(dialog.open, false);
    assert.equal(documentModel.body.style.overflow, "auto");
    assert.equal(modalCloses, modalOpens);
  } finally {
    await act(async () => {
      renderer?.unmount();
    });
    if (previousDocument)
      Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});

test("unsupported modal behavior preserves direct-image fallback links", async () => {
  let renderer!: ReactTestRenderer;
  await act(async () => {
    renderer = create(
      createElement(AboutImageGallery, { items: images.slice(0, 1) }),
      {
        createNodeMock: (element) => (element.type === "dialog" ? {} : null),
      },
    );
  });
  try {
    let prevented = false;
    await act(async () => {
      renderer.root.findByType("a").props.onClick({
        button: 0,
        preventDefault() {
          prevented = true;
        },
      });
    });
    assert.equal(prevented, false);
    assert.equal(renderer.root.findAllByType("figure").length, 0);
    assert.equal(renderer.root.findByType("a").props.href, images[0].src);
  } finally {
    await act(async () => {
      renderer.unmount();
    });
  }
});
