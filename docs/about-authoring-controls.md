# About alignment and image sizing — draft

This draft adds authoring controls to the four existing About section layouts. No About records, images, drafts or published content are written or migrated. Existing body formatting and image sizes remain the default. The requested layout adjustment centers the image-left section's copy block within its column on desktop; the text keeps its existing left alignment unless the author chooses another alignment. Its maximum width is 400 pixels, and mobile copy uses the full column again.

## Editing steps after this draft is deployed

1. In **/studio**, choose **About** under **Publish**, then open an item under **About sections** in the native form.
2. For body text, click inside the paragraph, heading, quote or list item. **Left / Center / Right** controls appear immediately above that block. Choose **Center** for that paragraph. Repeat for other paragraphs that need the same alignment. **Left** removes that paragraph's override. New paragraphs begin with the existing left alignment.
3. For a section headline, use **Headline alignment** below its headline field. The three-column layout has separate **Left headline alignment** and **Right headline alignment** controls. These choices do not move the body text or change its paragraph settings.
4. To resize the section image, enter a whole number from **160 to 800** in **Image width (px)**. Leave it blank to retain the existing layout. For the center chart, **600** is a useful larger starting point on a wide desktop. The setting controls the full image canvas, including any transparent padding.
5. Review the paragraph feedback and field values before publishing. Changes remain a Sanity draft until you choose **Publish**. About currently has the native form only; the existing **Preview** tab belongs to Posts. This code draft does not publish the document or merge itself.

These controls support left, center and right alignment, rather than full justification of word spacing. Strong/emphasis, safe links, heading levels, list types/indentation, line breaks, inline images and captions keep their native Portable Text representation. Section keys and source order remain intact. Blog and other Post bodies keep their existing editor and renderer defaults.

## Native editor compatibility

The installed Sanity 6.17.0 schema validator rejects extra `fields` on Portable Text block declarations. Paragraph alignment therefore lives in optional `bodyAlignments`, `leftBodyAlignments` or `rightBodyAlignments` settings alongside the body, keyed by the existing block `_key`. A supported `components.block` renderer calls `renderDefault` for the native content and uses Sanity's public form callbacks/value hooks to apply keyed field patches. It also shows the chosen alignment while editing, including within the native fullscreen editor. No editor is forked, and native toolbar, marks, selection, resizing and fullscreen rendering stay in place.

Changing alignment updates only the corresponding keyed settings item. The Left action removes that override. Removed paragraphs' stale settings are cleaned up when an alignment action is next used in that body. Reordering paragraphs keeps settings attached to their keys. The published-only GROQ projection and native About adapter already preserve these optional settings; existing documents need no conversion. The public renderer attaches validated alignment to an ephemeral copy of the block, leaving its saved Portable Text unchanged.

Source basis: the installed public `BlockProps`, `useFormCallbacks` and `useFormValue` APIs, the native TextBlock/default renderer source, the installed schema validator, and [Sanity's editor customization documentation](https://www.sanity.io/docs/studio/customizing-the-portable-text-editor), read as inert HTTP source. Regression tests compile the Studio schema and apply real native form patches with the installed local Sanity mutation engine; these tests contact no CMS.

## Responsive image behavior and the chart diagnosis

An optional width resizes the image's grid track as well as the image itself. Two-column sections reserve at least 240 pixels for copy; three-column sections reserve at least 200 pixels for each copy column. The remaining width and existing gaps cap the requested image width. Below 801 pixels, sections stack and the image fits the lesser of its requested width and the available container width. Images retain `height: auto`, original aspect ratio, alt text and their entire canvas; no crop, transform or fixed section height is applied. The section's height follows whichever is taller: its image or copy.

The current published chart is 1536 × 1024 pixels, but the existing three equal columns in a 1080-pixel container, separated by two 32-pixel gaps, allocate it about **339 × 226 CSS pixels** on a wide desktop. The bright shape above alpha 128 occupies **912 × 884** source pixels, with bounds `(312, 51)` to `(1224, 935)`: about **59% of the canvas width**. Its inferred bright width is therefore around **201 CSS pixels**. Faint glow extends farther; alpha above 16 spans 948 × 920 pixels, while near-transparent pixels extend nearly to the canvas edges. The alpha measurement and local image inspection used non-browser tools.

At a 1440-pixel viewport, a requested 600-pixel chart width fits: its canvas becomes **600 × 400 CSS pixels**, with 208-pixel copy columns and an inferred bright width around **356 pixels**. At narrower desktop widths the setting is capped to leave readable copy space. These dimensions are inferred from source and pixel bounds, not measured in a rendered browser. Increasing source resolution alone does not change the CSS width or remove padding.

## Verification limits

The explicit no-browser constraint supersedes this repository's screenshot and live-control review requirements. No browser, headless renderer, screenshot tool or browser permission request was used. Native click/focus/keyboard behavior, rendered responsive layout, visual Studio feedback and exact appearance in light/dark themes remain unverified. The supplied editor screenshot could not be downloaded through the supported Library route, so its pixels were not inspected. Source inspection, native schema compilation, local patch application, JSON/adaptor roundtrips and server-rendered HTML checks provide the verification for this draft.
