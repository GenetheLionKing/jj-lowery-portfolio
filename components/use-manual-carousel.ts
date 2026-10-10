"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type FocusEvent } from "react";

const subscribe = () => () => {};
export function useClientReady() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/** Native scrolling remains usable without JS. Enhancement never starts a timer. */
export function useManualCarousel(keys: string[]) {
  const [currentKey, setCurrentKey] = useState(keys[0]);
  const selectedKeyRef = useRef(keys[0]);
  const viewportRef = useRef<HTMLUListElement>(null);
  const slidesRef = useRef<(HTMLLIElement | null)[]>([]);
  const activeIndex = Math.max(0, keys.indexOf(currentKey));
  const keySignature = JSON.stringify(keys);

  function scrollTo(index: number) {
    const viewport = viewportRef.current;
    const first = slidesRef.current[0];
    const slide = slidesRef.current[index];
    if (viewport && first && slide) viewport.scrollTo({ left: slide.offsetLeft - first.offsetLeft, top: 0, behavior: "instant" });
  }

  function navigate(index: number) {
    const next = Math.max(0, Math.min(keys.length - 1, index));
    if (!keys[next]) return;
    selectedKeyRef.current = keys[next];
    setCurrentKey(keys[next]);
    scrollTo(next);
  }

  useEffect(() => {
    const orderedKeys: string[] = JSON.parse(keySignature);
    const align = () => scrollTo(Math.max(0, orderedKeys.indexOf(selectedKeyRef.current)));
    align();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    let width = viewport.clientWidth;
    const observer = new ResizeObserver(() => {
      if (viewport.clientWidth !== width) { width = viewport.clientWidth; align(); }
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [keySignature]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport?.style) return;
    const resize = () => {
      const orderedKeys: string[] = JSON.parse(keySignature);
      const index = Math.max(0, orderedKeys.indexOf(selectedKeyRef.current));
      const slide = slidesRef.current[index];
      if (!slide) return;
      const scrollbar = Math.max(0, viewport.offsetHeight - viewport.clientHeight);
      const size = `${slide.offsetHeight + 16 + scrollbar}px`;
      if (viewport.style.height !== size) viewport.style.height = size;
      viewport.scrollTop = 0;
    };
    resize();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(resize);
    slidesRef.current.forEach((slide) => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, [keySignature, currentKey]);

  function onScroll() {
    const viewport = viewportRef.current;
    const first = slidesRef.current[0];
    if (!viewport || !first) return;
    let nearest = 0, distance = Infinity;
    slidesRef.current.slice(0, keys.length).forEach((slide, index) => {
      if (!slide) return;
      const difference = Math.abs(slide.offsetLeft - first.offsetLeft - viewport.scrollLeft);
      if (difference < distance) { nearest = index; distance = difference; }
    });
    if (keys[nearest]) { selectedKeyRef.current = keys[nearest]; setCurrentKey(keys[nearest]); }
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    // Badge buttons, rich links and native details keep their own key behavior.
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const next = event.key === "ArrowRight" ? activeIndex + 1 : event.key === "ArrowLeft" ? activeIndex - 1 : event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1 : undefined;
    if (next !== undefined) { event.preventDefault(); navigate(next); }
  }

  function onFocus(event: FocusEvent<HTMLUListElement>) {
    const index = slidesRef.current.slice(0, keys.length).findIndex((slide) => slide?.contains(event.target));
    if (index !== -1) navigate(index);
  }

  return { activeIndex, viewportRef, slidesRef, navigate, onScroll, onKeyDown, onFocus };
}
