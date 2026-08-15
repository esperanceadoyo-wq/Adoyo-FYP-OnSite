"use client";

import { useSyncExternalStore } from "react";

const SHOW_AFTER_PX = 640;

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return window.scrollY > SHOW_AFTER_PX;
}

export function BackToTopButton() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ behavior: reduceMotion ? "auto" : "smooth", top: 0 });
  }

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface shadow-lg transition-[opacity,transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary-container focus-visible:opacity-100 md:bottom-6 md:right-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={scrollToTop}
      tabIndex={isVisible ? 0 : -1}
      title="Back to top"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="m6 15 6-6 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
