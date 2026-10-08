import { defineField } from "sanity";
import { aboutGallerySchema } from "../content/model";
import { nativeImageData } from "../content/native-media";
import { aboutGalleryThumbnailRatio } from "../content/about-gallery-image";

export const aboutGalleryField = defineField({
  name: "gallery",
  title: "Image gallery",
  type: "array",
  description:
    "Choose 1–6 images and drag to reorder. Thumbnails fill a 3:2 landscape frame. Use Crop image to adjust the crop and hotspot (the area to keep visible). The enlarged viewer shows the original image. Leave empty to hide the gallery. Add alternative text and optional captions. Uploaded assets are public, including draft attachments.",
  options: { layout: "grid", sortable: true },
  of: [
    {
      type: "image",
      title: "Gallery image",
      options: {
        accept: "image/jpeg,image/png,image/webp",
        hotspot: {
          previews: [
            {
              title: "About thumbnail (3:2)",
              aspectRatio: aboutGalleryThumbnailRatio,
            },
          ],
        },
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .max(12000)
              .custom((value) =>
                !value || value.trim()
                  ? true
                  : "Describe what this image shows",
              ),
        }),
        defineField({
          name: "caption",
          title: "Caption (optional)",
          type: "text",
          rows: 2,
          validation: (rule) => rule.max(12000),
        }),
      ],
      preview: {
        select: { title: "alt", subtitle: "caption", media: "asset" },
      },
    },
  ],
  validation: (rule) =>
    rule.max(6).custom((value) => {
      if (!Array.isArray(value)) return true;
      try {
        const result = aboutGallerySchema.safeParse(
          value.map((image) =>
            nativeImageData(image, {
              projectId: "validation",
              dataset: "portfolio",
            }),
          ),
        );
        return result.success ? true : result.error.issues[0].message;
      } catch (error) {
        return error instanceof Error
          ? error.message
          : "Add a valid gallery image";
      }
    }),
});
