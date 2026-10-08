import { createImageUrlBuilder } from "@sanity/image-url";
import type { AboutGalleryImage } from "./model";

export const aboutGalleryThumbnailSize = { width: 600, height: 400 } as const;
export const aboutGalleryThumbnailRatio = 3 / 2;

/** Crop only the thumbnail; the viewer and fallback link keep the original URL. */
export function aboutGalleryThumbnail(image: AboutGalleryImage) {
  if (!image.src.startsWith("https://cdn.sanity.io/images/")) return image.src;
  const [, , projectId, dataset] = new URL(image.src).pathname.split("/");
  return createImageUrlBuilder({ projectId, dataset })
    .image({
      asset: { url: image.src },
      crop: image.crop ?? undefined,
      hotspot: image.hotspot ?? undefined,
    })
    .width(aboutGalleryThumbnailSize.width)
    .height(aboutGalleryThumbnailSize.height)
    .fit("crop")
    .quality(80)
    .auto("format")
    .url();
}
