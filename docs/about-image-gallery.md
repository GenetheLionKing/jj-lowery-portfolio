# About image gallery

The hero gallery now belongs to the About document. **Publish → About → Image gallery** uses Sanity's native image picker and sortable grid. Choose one to six images, add meaningful alternative text and optional captions, and drag them into the intended order. Missing, unset or explicitly empty gallery data hides the strip. Clearing the last image can safely unset the field; there is no fallback to Post selections and no initial gallery is written to existing documents.

Thumbnails sit below the original hero and before the lower About sections. Each opens a native modal image viewer with the full image canvas, caption, Close button, position indicator and Previous/Next controls when there is more than one image. Escape closes it; left/right arrows cycle images; Tab/Shift+Tab stay within its controls. Opening focuses Close, and closing or unmounting restores the exact thumbnail opener and page scrolling. Native `showModal()` makes the background inert. Thumbnail links point to the image itself as a usable fallback without JavaScript or modal support; modified clicks keep that URL's normal behavior. No gallery thumbnail links to a Post.

Thumbnails fill the existing 3:2 landscape frame with no inset padding. The native crop and hotspot determine which part of each Sanity image appears: Sanity's image URL builder produces a 600×400 crop that fits the requested ratio around the selected hotspot, inside the crop bounds. Images without framing metadata use a center crop. The original image URL, asset reference and dimensions remain intact; the enlarged viewer continues to show the full image with `object-fit: contain` and no crop/hotspot URL parameters. Local static image fallbacks fill the thumbnail using CSS `cover`.

The viewer fits the viewport and scrolls when a long caption needs room. The strip adapts to two, three, four or six columns and reuses the site's neutral and Emerald tokens. Caption text is rendered as plain text. Public reads resolve native asset URLs/dimensions and preserve the author’s keys, order, alt text, captions, crop and hotspot; drafts and release versions remain excluded. The only added direct dependency is the already-resolved `@sanity/image-url` 2.1.1 helper. No animation is added.

## Adjust thumbnail framing

1. Open **Publish → About → Image gallery** and open a **Gallery image** entry.
2. Click the image's crop icon, whose tooltip is **Crop image** (accessible label **Open image edit dialog**). The native dialog is titled **Edit hotspot and crop**; its controls are labeled **Hotspot & Crop**.
3. Move and resize the hotspot circle over the area to keep visible, such as the face in a portrait. Adjust the crop rectangle only if you want to exclude source edges. Check the **About thumbnail (3:2)** preview. A hotspot larger than the available 3:2 crop cannot be entirely retained, so keep the important region within the preview.
4. Close the dialog when satisfied. Native changes autosave in the About draft. Review the whole draft and publish when ready; the public site continues to use only published values. Selecting a thumbnail still opens the full original image.

These labels are verified against the installed Sanity 6.17.0 source and compiled schema. Live browser interaction and appearance have not been inspected.

## Migration and release

1. Release the approved schema and viewer before using the field. A code release does not upload, choose or publish any gallery images, and does not modify existing About content.
2. After the feature is approved and released, open **About → Image gallery**. Select the specific existing assets you want or upload your own images. Uploads are public even while the About document remains a draft. No images are copied from Posts or chosen automatically.
3. Review alt text, optional captions and order in the native form. The About editor currently has no Preview tab; the existing Post Preview tab is separate. The public site continues to show only published About data.
4. Publish the About document only when you approve its complete draft, including other pending section/text changes. This PR does not publish it. The existing public refresh interval is 60 seconds.

The old `about-gallery` Post tag and saved choices remain intact, with an explicit legacy label in Studio. They no longer drive this gallery. Other Post placements, main images, canonical URLs, Blog uses and existing story-link behavior remain unchanged. The `/about/story/` route and the independent `storyHref`/story CTA contract are retained; selecting gallery photos never chooses a story destination. A read-only checkpoint found no current legacy gallery selections and no existing gallery field, so the initial public strip remains empty until the owner selects and publishes images. Existing About content and pending draft sections are preserved.

## Verification

The no-browser constraint overrides the repository's browser/screenshot workflow. Tests use the real native schema validator, published adapters, server-rendered HTML and React's in-memory component renderer. They check one to six images, reorder/serialization, null/unset/empty behavior, alt/assets/key/framing validation, equal assets with distinct keys, Post independence, story-link preservation, crop geometry for portrait/landscape/square images, retention of a chosen hotspot, full-image fallback links and the viewer's actual open/navigation/close/focus/scroll handlers. The opened viewer is checked for its original aspect and absence of crop parameters. Mock element methods are ordinary JavaScript objects; they do not launch or render a browser.

Actual browser focus/inert behavior, keyboard activation, responsive appearance at 320/390/768/1440 pixels, zoom, contrast and screen-reader output remain unverified. The earlier supplementary Library screenshot was not inspected. The thumbnail-framing screenshot also could not be retrieved on the local executor after two supported attempts; its pixels were not inspected. No screenshot or visual certification is claimed.
