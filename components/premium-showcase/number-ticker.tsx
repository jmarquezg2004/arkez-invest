"use client";

// Adapted from Magic UI Number Ticker (MIT). Copyright (c) Magic UI.
// https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/apps/www/registry/magicui/number-ticker.tsx
// Full license in docs/licencias/magic-ui-mit.md.
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

const percentage = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero",
});
const display = (value: number) => `${percentage.format(value)} %`;

export function PremiumNumberTicker({ value }: { value: number }) {
  const initial = useRef(value);
  const visual = useRef<HTMLSpanElement>(null);
  const target = useMotionValue(value);
  const spring = useSpring(target, { damping: 24, stiffness: 148 });
  const visible = useInView(visual, { once: true });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    function render(next: number) {
      if (visual.current) visual.current.textContent = display(next);
    }
    const stop = spring.on("change", (current) => render(reduce.matches ? value : current));
    if (visible && !reduce.matches) target.set(value);
    else {
      spring.jump(value);
      target.jump(value);
      render(value);
    }
    const reset = () => { if (reduce.matches) { spring.jump(value); render(value); } };
    reduce.addEventListener("change", reset);
    return () => { stop(); reduce.removeEventListener("change", reset); };
  }, [spring, target, value, visible]);

  return <><span className="sr-only">{display(value)}</span><span aria-hidden="true" ref={visual}>{display(initial.current)}</span></>;
}
