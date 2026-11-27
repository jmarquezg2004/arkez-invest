"use client";

import { useEffect, useRef } from "react";
import type { StaticImageData } from "next/image";

export function LessonIllustration({ image, x, y }: { image: StaticImageData; x: number; y: number }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const panel = ref.current;
    if (!panel || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    panel.style.setProperty("--scene-x", `${x}%`);
    panel.style.setProperty("--scene-y", `${y}%`);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      panel.dataset.inView = "true";
      observer.disconnect();
    }, { threshold: .6 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [x, y]);

  return <figure className="ai-lesson-art" ref={ref}>
    <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
  </figure>;
}
