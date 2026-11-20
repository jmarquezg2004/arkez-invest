"use client";

import { useEffect } from "react";

export function RevealSections() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-enter");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.14 });
    document.querySelectorAll("[data-reveal]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return null;
}
