"use client";

import { useEffect, useRef, useState } from "react";
import { AllocationMark, ChainMark, EducationMark, InsightMark, TechnologyMark } from "@/components/arkez-icons";
import { innovationTopics } from "@/lib/innovation";

const marks = [AllocationMark, ChainMark, InsightMark, EducationMark, TechnologyMark];
const paths = [
  "M32 83H124Q151 83 172 47H278 M124 83Q151 83 172 119H278",
  "M32 83H103Q122 83 122 61H200Q218 61 218 83H278",
  "M32 109 88 65 145 91 204 46 278 61",
  "M32 117H93V90H151V62H215V34H278",
  "M32 83H108M108 83Q150 83 184 40H278M108 83H278M108 83Q150 83 184 126H278",
];

export function PrototypeAtlas() {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = root.current;
    if (!panel || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setSelected(Number((visible.target as HTMLElement).dataset.atlasStep));
    }, { rootMargin: "-49% 0px -48% 0px" });
    panel.querySelectorAll("[data-atlas-step]").forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const topic = innovationTopics[selected];
  const Mark = marks[selected];
  return <div className="proto-atlas" ref={root}>
    <div className="atlas-screen">
      <div className="atlas-status"><Mark size={24} /><span>{topic.short}</span></div>
      <svg viewBox="0 0 310 165" className="atlas-graphic" role="img" aria-label={topic.visual}>
        <path className="atlas-grid" d="M32 18v130M88 18v130M145 18v130M204 18v130M278 18v130M32 34h246M32 83h246M32 126h246"/>
        {paths.map((shape, index) => <path key={shape} className="atlas-trace" data-selected={selected === index} pathLength="1" d={shape} />)}
        <circle cx="32" cy={selected === 2 ? 109 : selected === 3 ? 117 : 83} r="4" />
      </svg>
      <ol className="atlas-steps" aria-label="Secuencia representada">{topic.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <nav aria-label="Temas de Innovation Hub" className="atlas-controls">
        {innovationTopics.map(({id, short}, index) => <a key={id} aria-current={selected === index ? "location" : undefined}
          href={`#${id}`} onClick={() => setSelected(index)} aria-label={`${index + 1}. ${short}`}>{index + 1}</a>)}
      </nav>
    </div>
    <div className="atlas-chapters">
      {innovationTopics.map(({id,title,explanation,example,risk,resource}, index) => <article key={id} id={id} data-atlas-step={index}>
        <p className="proto-kicker">{innovationTopics[index].short}</p>
        <h2>{title}</h2>
        <p>{explanation}</p>
        <details><summary>Ejemplo y riesgos</summary><p>{example}</p><p>{risk}</p></details>
        <a className="proto-text-link" href={resource.href}>{resource.label}</a>
      </article>)}
    </div>
  </div>;
}
