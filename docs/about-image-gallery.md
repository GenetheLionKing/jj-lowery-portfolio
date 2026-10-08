# About image gallery — draft PR

The hero gallery now belongs to the About document. **Publish → About → Image gallery** uses Sanity's native image picker and sortable grid. Choose one to six images, add meaningful alternative text and optional captions, and drag them into the intended order. Missing, unset or explicitly empty gallery data hides the strip. Clearing the last image can safely unset the field; there is no fallback to Post selections and no initial gallery is written to existing documents.

Thumbnails sit below the original hero and before the lower About sections. Each opens a native modal image viewer with the full image canvas, caption, Close button, position indicator and Previous/Next controls when there is more than one image. Escape closes it; left/right arrows cycle images; Tab/Shift+Tab stay within its controls. Opening focuses Close, and closing or unmounting restores the exact thumbnail opener and page scrolling. Native `showModal()` makes the background inert. Thumbnail links point to the image itself as a usable fallback without JavaScript or modal support; modified clicks keep that URL's normal behavior. No gallery thumbnail links to a Post.

Images retain their intrinsic dimensions. Thumbnails and the viewer use `object-fit: contain`; the viewer fits the viewport and scrolls when a long caption needs room. The strip adapts to two, three, four or six columns, reuses the site's neutral and Emerald tokens, and adds no animation or dependencies. Caption text is rendered as plain text. Public reads resolve native asset URLs/dimensions and preserve the author’s keys, order, alt text and captions; drafts and release versions remain excluded.

## Migration and release

1. Review this draft PR before merging. No production release, image upload, CMS mutation or publication is performed by this work.
2. After the feature is approved and released, open **About → Image gallery**. Select the specific existing assets you want or upload your own images. Uploads are public even while the About document remains a draft. No images are copied from Posts or chosen automatically.
3. Review alt text, optional captions and order in the native form. The About editor currently has no Preview tab; the existing Post Preview tab is separate. The public site continues to show only published About data.
4. Publish the About document only when you approve its complete draft, including other pending section/text changes. This PR does not publish it. The existing public refresh interval is 60 seconds.

The old `about-gallery` Post tag and saved choices remain intact, with an explicit legacy label in Studio. They no longer drive this gallery. Other Post placements, main images, canonical URLs, Blog uses and existing story-link behavior remain unchanged. The `/about/story/` route and the independent `storyHref`/story CTA contract are retained; selecting gallery photos never chooses a story destination. A read-only checkpoint found no current legacy gallery selections and no existing gallery field, so the initial public strip remains empty until the owner selects and publishes images. Existing About content and pending draft sections are preserved.

## Verification

The no-browser constraint overrides the repository's browser/screenshot workflow. Tests use the real native schema validator, published adapters, server-rendered HTML and React's in-memory component renderer. They check one to six images, reorder/serialization, null/unset/empty behavior, alt/assets/key validation, equal assets with distinct keys, Post independence, story-link preservation, full-image fallback links and the viewer's actual open/navigation/close/focus/scroll handlers. Mock element methods are ordinary JavaScript objects; they do not launch or render a browser.

Actual browser focus/inert behavior, keyboard activation, responsive appearance at 320/390/768/1440 pixels, zoom, contrast and screen-reader output remain unverified. The supplementary Library screenshot was not inspected. No screenshot or visual certification is claimed. The PR remains a draft and is not merged.
