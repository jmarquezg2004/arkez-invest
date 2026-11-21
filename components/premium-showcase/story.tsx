"use client";

import { useEffect, useRef, useState } from "react";
import { AllocationMark, EducationMark, MarketMark } from "@/components/arkez-icons";
import { FrameLabel } from "./visuals";

const steps = [
  { name: "Define una meta", text: "Establece cuánto quieres ahorrar, en qué plazo y cuánto podrías aportar cada mes.", mark: EducationMark, label: "Meta de ahorro", value: "COP 12.000.000", detail: "Horizonte ilustrativo · 5 años" },
  { name: "Compara escenarios", text: "Cambia un supuesto a la vez. Así puedes entender cuánto depende la proyección de tus aportes y cuánto de la tasa.", mark: MarketMark, label: "Dos tasas de ejemplo", value: "0 % / 6 %", detail: "Mismo capital inicial, aporte y plazo" },
  { name: "Revisa qué puede cambiar", text: "Anota los costos y los riesgos que quedaron fuera del ejemplo. Vuelve a la calculadora con esos límites en mente.", mark: AllocationMark, label: "Antes de aplicar el resultado", value: "Costos y riesgos", detail: "Una proyección depende de sus supuestos" },
] as const;

export function PremiumStory() {
  const [active, select] = useState(0);
  const story = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layout = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const entries = story.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!entries?.length) return;

    function track() {
      if (!layout.matches) return;
      const edge = window.innerHeight * .56;
      let index = 0;
      entries?.forEach((item, i) => { if (item.getBoundingClientRect().top < edge) index = i; });
      select(index);
    }
    window.addEventListener("scroll", track, { passive: true });
    window.addEventListener("resize", track, { passive: true });
    layout.addEventListener("change", track);
    track();
    return () => {
      window.removeEventListener("scroll", track);
      window.removeEventListener("resize", track);
      layout.removeEventListener("change", track);
    };
  }, []);

  const step = steps[active];
  const Mark = step.mark;

  return <div className="px-story-layout" ref={story}>
    <div className="px-story-stage" data-scene={active}>
      <FrameLabel title="De la meta al escenario" badge={`Etapa ${active + 1} de ${steps.length}`} />
      <div className="px-story-scene" key={step.name}>
        <div className="px-story-icon"><Mark size={34} /></div>
        <span>{step.label}</span><strong>{step.value}</strong><p>{step.detail}</p>
        <svg aria-hidden="true" viewBox="0 0 360 75"><path className="px-story-wire" d="M12 60H106L151 20H240L282 50H345" pathLength="1" /><path className="px-story-nodes" d="M12 60h1 M151 20h1 M282 50h1 M344 50h1" /></svg>
      </div>
    </div>
    <ol className="px-story-steps" role="list">
      {steps.map(({ name, text }, i) => <li key={name} data-chapter={i} data-current={active === i}>
        <h3><button type="button" aria-pressed={active === i} onClick={() => select(i)}><span>{String(i+1).padStart(2,"0")}</span>{name}</button></h3>
        <p>{text}</p>
      </li>)}
    </ol>
  </div>;
}
