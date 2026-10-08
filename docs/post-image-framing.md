# Post image framing

Blog featured and archive thumbnails share a 16:9 landscape frame. Both fill the frame using a crop that honors the Post's native crop and hotspot. Featured images request 960×540 pixels; archive images request 640×360. Shared Portfolio/Learn cards retain their established 4:3 geometry and use the same framing metadata for 640×480 crops. Alt text, destinations, order and article copy remain unchanged.

The image builder used by About is shared rather than duplicating crop math. The Post's published image projection and Article/Case models retain crop/hotspot values, so the native editor's choices reach the thumbnails. Missing/null framing metadata uses a center crop. Local artwork fallbacks use CSS `cover`; choose a native **Main image** for editor-controlled framing.

Article covers and inline images keep their original source framing and dimensions. The crop controls here affect thumbnails. The Post **Preview** tab shows the article's full cover; use the framing preview inside the image tool to judge Blog thumbnails.

## Studio steps

1. Refresh Studio, then open **Publish → Posts — all pages** and choose the Post.
2. Open the top-level **Main image** field. Select an existing asset or upload a JPG, PNG or WebP if no main image is set. Retain meaningful **Alternative text**.
3. Click the crop icon, tooltip **Crop image** (accessible label **Open image edit dialog**). The dialog is titled **Edit hotspot and crop**; its image controls are labeled **Hotspot & Crop**.
4. Move and resize the hotspot circle over the important region, such as the face in a portrait. Adjust the crop rectangle to exclude unwanted source edges or whitespace contained in the image itself. Check **Blog thumbnail (16:9)** for both featured and archive positions. If the Post also appears in Portfolio or Learn, check **Portfolio / Learn card (4:3)** too. Keep the important region within each preview; a hotspot larger than a frame cannot be fully retained.
5. Close the dialog when satisfied. Native edits autosave in the Post draft. Review the whole Post and its destinations, then publish only when ready. The public site uses published values on its existing 60-second refresh interval.

These control labels are verified against the installed Sanity 6.17.0 source and compiled schema. The code release does not write or publish a Post, change an asset reference, overwrite a crop choice, or choose a focal point automatically. Existing records without framing remain valid.

## Verification

The source defects were `contain` on Blog featured/archive images, width-only image URLs, disabled Main image crop controls, and crop/hotspot values discarded by the Post image projection and models. The fix changes thumbnail framing and carries native metadata through the authoring/public paths.

Non-browser regressions run the actual published GROQ against a local fixture dataset, native/Post Preview/public/catalog adapters, Sanity's real native schema validator, portrait/landscape/square crop geometry with edge hotspots, server-rendered featured/archive/shared cards, and uncropped article cover/inline image markup. The existing About regressions verify that extracting its image builder leaves the gallery and viewer behavior intact.

Browser use is prohibited for this task. Both supplied Library screenshots were unavailable on the local executor after two supported retrieval attempts; their pixels were not inspected. Browser layout at 320/390/768/1440 pixels, live native crop controls, zoom, contrast and screen-reader behavior remain unverified. No screenshot or visual certification is claimed.
