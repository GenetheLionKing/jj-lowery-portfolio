"use client";

import Image from "next/image";
import { useId } from "react";
import type { AboutCarouselImage } from "@/content/model";
import { sizedPublicImage } from "@/content/media";
import { useAboutImageViewer } from "./about-image-viewer";
import { useClientReady, useManualCarousel } from "./use-manual-carousel";

export function AboutImageCarousel({ items, label }: { items: AboutCarouselImage[]; label: string }) {
  const { viewerId, openImage, viewer } = useAboutImageViewer(items, true);
  const { activeIndex, viewportRef, slidesRef, navigate, onScroll, onKeyDown, onFocus } = useManualCarousel(items.map((item) => item._key));
  const enhanced = useClientReady();
  const id = useId();
  if (!items.length) return null;
  return (
    <div className="about-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <p className="about-carousel__hint">Scroll through the images. Select an image to enlarge it.</p>
      <ul id={id} ref={viewportRef} className="about-carousel__slides" tabIndex={items.length > 1 ? 0 : undefined}
        aria-label="Image slides" onScroll={onScroll} onKeyDown={onKeyDown} onFocusCapture={onFocus}>
        {items.map((item, index) => (
          <li key={item._key} ref={(node) => { slidesRef.current[index] = node; }} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}`}>
            <figure className="about-carousel__image">
              <a href={item.src} aria-label={`Enlarge image: ${item.alt}`} aria-haspopup="dialog" aria-controls={viewerId} onClick={(event) => openImage(index, event)}>
                <Image unoptimized src={sizedPublicImage(item.src, 1800)} width={item.width} height={item.height} alt={item.alt} loading="lazy" sizes="(max-width: 700px) calc(100vw - 56px), 1064px" />
              </a>
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      <div className="about-carousel__controls">
        {enhanced && items.length > 1 && <button type="button" aria-label="Previous slide" aria-controls={id} aria-disabled={activeIndex === 0} onClick={() => navigate(activeIndex - 1)}>Previous</button>}
        <p role="status" aria-live={enhanced ? "polite" : "off"}>{enhanced ? `Image ${activeIndex + 1} of ${items.length}` : `${items.length} ${items.length === 1 ? "image" : "images"}`}</p>
        {enhanced && items.length > 1 && <button type="button" aria-label="Next slide" aria-controls={id} aria-disabled={activeIndex === items.length - 1} onClick={() => navigate(activeIndex + 1)}>Next</button>}
      </div>
      {viewer}
    </div>
  );
}
