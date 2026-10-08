"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { sizedPublicImage } from "@/content/media";
import type { AboutGalleryImage } from "@/content/model";

export function AboutImageGallery({ items }: { items: AboutGalleryImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);
  const titleId = useId();
  const captionId = useId();
  const viewerId = useId();
  const active = selected === null ? undefined : items[selected];
  const isOpen = !!active;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = originalOverflow;
      openerRef.current?.focus();
    };
  }, [isOpen]);

  function move(direction: number) {
    setSelected((current) =>
      current === null
        ? null
        : (current + direction + items.length) % items.length,
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setSelected(null);
    } else if (items.length > 1 && event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (items.length > 1 && event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Tab") {
      const controls = [
        closeRef.current,
        previousRef.current,
        nextRef.current,
      ].filter((control): control is HTMLButtonElement => !!control);
      const first = controls[0];
      const last = controls.at(-1);
      const focused = document.activeElement;
      if (
        event.shiftKey &&
        (focused === first || !controls.some((control) => control === focused))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (focused === last || !controls.some((control) => control === focused))
      ) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  if (!items.length) return null;
  return (
    <section
      className="container about-image-gallery"
      aria-label="About images"
    >
      <ul className="about-image-gallery__thumbnails">
        {items.map((item, index) => (
          <li key={item._key}>
            <a
              href={item.src}
              aria-label={`Enlarge image: ${item.alt}`}
              aria-haspopup="dialog"
              aria-controls={viewerId}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  typeof dialogRef.current?.showModal !== "function"
                )
                  return;
                event.preventDefault();
                openerRef.current = event.currentTarget;
                setSelected(index);
              }}
            >
              <Image
                unoptimized
                src={sizedPublicImage(item.src, 400)}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
      <dialog
        id={viewerId}
        ref={dialogRef}
        className="about-image-viewer"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={active?.caption ? captionId : undefined}
        onKeyDown={handleKeyDown}
        onCancel={(event) => {
          event.preventDefault();
          setSelected(null);
        }}
        onClose={() => setSelected(null)}
      >
        {active && (
          <>
            <header className="about-image-viewer__header">
              <h2 id={titleId}>Image viewer</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close image viewer"
              >
                Close
              </button>
            </header>
            <figure className="about-image-viewer__figure">
              <Image
                unoptimized
                src={sizedPublicImage(active.src, 1800)}
                alt={active.alt}
                width={active.width}
                height={active.height}
              />
              {active.caption && (
                <figcaption id={captionId}>{active.caption}</figcaption>
              )}
            </figure>
            <footer className="about-image-viewer__footer">
              <p role="status" aria-live="polite">
                Image {(selected ?? 0) + 1} of {items.length}
              </p>
              {items.length > 1 && (
                <div role="group" aria-label="Image navigation">
                  <button
                    ref={previousRef}
                    type="button"
                    aria-label="Previous image"
                    onClick={() => move(-1)}
                  >
                    Previous
                  </button>
                  <button
                    ref={nextRef}
                    type="button"
                    aria-label="Next image"
                    onClick={() => move(1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </footer>
          </>
        )}
      </dialog>
    </section>
  );
}
