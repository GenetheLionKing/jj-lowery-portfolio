import { createImageUrlBuilder } from "@sanity/image-url";
import type { FramedImage } from "./model";

/** Native crop/hotspot applies only to thumbnail URLs; the source stays intact. */
export function imageThumbnail(
  image: Pick<FramedImage, "src" | "crop" | "hotspot">,
  size: { width: number; height: number },
) {
  if (!image.src.startsWith("https://cdn.sanity.io/images/")) return image.src;
  const [, , projectId, dataset] = new URL(image.src).pathname.split("/");
  return createImageUrlBuilder({ projectId, dataset })
    .image({
      asset: { url: image.src },
      crop: image.crop ?? undefined,
      hotspot: image.hotspot ?? undefined,
    })
    .width(size.width)
    .height(size.height)
    .fit("crop")
    .quality(80)
    .auto("format")
    .url();
}

export const postThumbnailSizes = {
  featured: { width: 960, height: 540 },
  blog: { width: 640, height: 360 },
  card: { width: 640, height: 480 },
} as const;
export const postThumbnailPreviews = [
  { title: "Blog thumbnail (16:9)", aspectRatio: 16 / 9 },
  { title: "Portfolio / Learn card (4:3)", aspectRatio: 4 / 3 },
];
