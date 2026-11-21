"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "caminos-arkez", label: "Caminos" },
  { id: "herramientas-arkez", label: "Herramientas" },
  { id: "recorrido", label: "Recorrido" },
  { id: "mapa-ia", label: "Mapa de IA" },
] as const;

export function ExperienceSectionNav() {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof sections)[number]["id"]>(sections[0].id);

  useEffect(() => {
    const element = nav.current;
    if (!element) return;
    const navElement = element;

    const targets = sections.flatMap(({ id }) => {
      const target = document.getElementById(id);
      return target ? [{ id, target }] : [];
    });
    let frame = 0;
    function read() {
      frame = 0;
      const line = navElement.getBoundingClientRect().bottom + 24;
      let current: (typeof sections)[number]["id"] = sections[0].id;
      for (const { id, target } of targets) {
        if (target.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(read);
    }
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <nav ref={nav} className="ax-subnav" aria-label="Secciones de Arkez Experience">
    <div className="ax-shell">
      {sections.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>)}
    </div>
  </nav>;
}
