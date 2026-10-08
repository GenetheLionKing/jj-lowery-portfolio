import type { AboutGalleryImage } from "./model";
import { imageThumbnail } from "./image-thumbnail";

export const aboutGalleryThumbnailSize = { width: 600, height: 400 } as const;
export const aboutGalleryThumbnailRatio = 3 / 2;

/** Crop only the thumbnail; the viewer and fallback link keep the original URL. */
export function aboutGalleryThumbnail(image: AboutGalleryImage) {
  return imageThumbnail(image, aboutGalleryThumbnailSize);
}
