"use client";

import Image from "next/image";
import {
  aboutGalleryThumbnail,
  aboutGalleryThumbnailSize,
} from "@/content/about-gallery-image";
import type { AboutGalleryImage } from "@/content/model";
import { useAboutImageViewer } from "./about-image-viewer";

export function AboutImageGallery({ items }: { items: AboutGalleryImage[] }) {
  const { viewerId, openImage, viewer } = useAboutImageViewer(items);
  if (!items.length) return null;
  return (
    <section className="container about-image-gallery" aria-label="About images">
      <ul className="about-image-gallery__thumbnails">
        {items.map((item, index) => (
          <li key={item._key}>
            <a
              href={item.src}
              aria-label={`Enlarge image: ${item.alt}`}
              aria-haspopup="dialog"
              aria-controls={viewerId}
              onClick={(event) => openImage(index, event)}
            >
              <span className="about-image-gallery__image">
                <Image unoptimized src={aboutGalleryThumbnail(item)} alt={item.alt}
                  width={aboutGalleryThumbnailSize.width} height={aboutGalleryThumbnailSize.height} loading="lazy" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {viewer}
    </section>
  );
}
