"use client";

import { useEffect, useRef, useState } from "react";
import { AllocationMark, ChainMark, InsightMark, MarketMark, RiskMark, TokenMark } from "@/components/arkez-icons";
import { journeyStages } from "@/lib/innovation-journey";

const marks = [MarketMark, InsightMark, ChainMark, TokenMark, AllocationMark, RiskMark];
const summaries = [
  "El índice ficticio parte de 100 puntos y termina en 115.",
  "La serie contiene seis observaciones que deben contrastarse con su fuente.",
  "El registro ilustrativo enlaza tres asientos: emisión, traspaso y verificación.",
  "Un subyacente puede representarse con un título tradicional o con un activo tokenizado.",
  "El portafolio ficticio tiene 50 % en acciones, 35 % en bonos y 15 % en activos digitales.",
  "Ante el choque hipotético, la cartera de referencia cae 3,5 % y la híbrida cae 7,4 %.",
] as const;
const spines = [
  [126, 106, 120, 78, 87, 54],
  [126, 106, 120, 78, 87, 54],
  [98, 98, 98, 98, 98, 98],
  [101, 101, 101, 58, 58, 58],
  [99, 99, 99, 99, 99, 99],
  [115, 115, 115, 115, 115, 115],
] as const;
const xs = [40, 119, 198, 277, 356, 435];
const path = (levels: readonly number[]) => levels.map((level, index) => `${index === 0 ? "M" : "L"}${xs[index]} ${level}`).join(" ");

function SceneAnnotations({ scene }: { scene: number }) {
  return <>
    {scene === 0 && <g className="scene-annotation">
      <text x="8" y="54">115</text><text x="8" y="129">100</text>
      <text x="40" y="157">Inicio</text><text x="397" y="157">Cierre</text>
      <path className="scene-axis" d="M40 54H435 M40 126H435"/>
    </g>}
    {scene === 1 && <g className="scene-annotation">
      {spines[1].map((y, index) => <circle key={index} cx={xs[index]} cy={y} r="5" className="scene-node" />)}
      <text x="42" y="159">Observaciones del índice</text><text x="344" y="159">Verificar fuente</text>
    </g>}
    {scene === 2 && <g className="scene-annotation">
      {[68, 233, 398].map((x, index) => <g key={x}>
        <rect x={x - 42} y="72" width="84" height="51" rx="5" className="scene-block"/>
        <text x={x} y="93" textAnchor="middle">0{index + 1}</text>
        <text x={x} y="148" textAnchor="middle">{["Emisión", "Traspaso", "Verificación"][index]}</text>
      </g>)}
    </g>}
    {scene === 3 && <g className="scene-annotation">
      <path className="scene-branch" d="M195 101Q235 101 255 133H435"/>
      <circle cx="195" cy="101" r="6" className="scene-node"/>
      <text x="40" y="129">Subyacente</text>
      <text x="433" y="38" textAnchor="end">Título tradicional</text>
      <text x="433" y="156" textAnchor="end">Activo tokenizado</text>
    </g>}
    {scene === 4 && <g className="scene-annotation">
      <rect x="40" y="88" width="197.5" height="21" rx="2" fill="#a5c3e3"/>
      <rect x="237.5" y="88" width="138.25" height="21" fill="#76a1c0"/>
      <rect x="375.75" y="88" width="59.25" height="21" rx="2" fill="#edcb8e"/>
      <text x="40" y="139">Acciones 50 %</text><text x="235" y="139">Bonos 35 %</text>
      <text x="435" y="160" textAnchor="end">Digitales 15 %</text>
    </g>}
    {scene === 5 && <g className="scene-annotation">
      <text x="40" y="54">Referencia</text><text x="40" y="101">Híbrida</text>
      <rect x="301.5" y="37" width="108.5" height="19" rx="3" fill="#a5c3e3"/>
      <rect x="180.6" y="85" width="229.4" height="19" rx="3" fill="#edcb8e"/>
      <path className="scene-axis" d="M410 26V119" />
      <text x="162" y="148">−8 %</text><text x="272" y="148">−4 %</text>
      <text x="416" y="148">0 %</text>
    </g>}
  </>;
}

export function InvestmentJourney() {
  const journey = useRef<HTMLElement>(null);
  const spine = useRef<SVGPathElement>(null);
  const progress = useRef<SVGLineElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = journey.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let activeScene = 0;

    function update() {
      frame = 0;
      if (!root || !spine.current || !progress.current) return;
      const viewport = window.innerHeight;
      const bounds = root.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewport) return;
      const center = viewport * .48;
      const centers = steps.map((step) => {
        const box = step.getBoundingClientRect();
        return box.top + box.height / 2;
      });
      const next = centers.findIndex((top) => top > center);
      const left = next === -1 ? spines.length - 1 : Math.max(0, next - 1);
      const right = next <= 0 ? left : next;
      const ratio = right === left ? 0 : (center - centers[left]) / (centers[right] - centers[left]);
      const scene = ratio < .5 ? left : right;
      const eased = ratio * ratio * (3 - 2 * ratio);
      spine.current.setAttribute("d", path(reduced.matches ? spines[scene] :
        spines[left].map((value, index) => value + (spines[right][index] - value) * eased)));
      progress.current.setAttribute("x2", String(40 + 395 * (reduced.matches ? scene : left + ratio) / (spines.length - 1)));
      if (scene !== activeScene) {
        activeScene = scene;
        setActive(scene);
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  const stage = journeyStages[active];
  const Mark = marks[active];
  return (
    <section className="journey" id="trayectoria" ref={journey} aria-labelledby="journey-title">
      <div className="container-shell">
        <div className="journey-intro">
          <p className="eyebrow">De la señal al escenario</p>
          <h2 id="journey-title">Cómo se construye un criterio de inversión</h2>
          <p>Recorre seis etapas de un caso ficticio. Cada una aporta preguntas distintas para evaluar un portafolio.</p>
        </div>
        <div className="journey-layout">
          <figure className="journey-stage" data-scene={active}>
            <figcaption><span className="journey-kicker"><Mark size={17} />{stage.subtitle}</span><span>{active + 1} / {journeyStages.length}</span><span className="sr-only">{summaries[active]}</span></figcaption>
            <div className="journey-frame">
              <strong>{stage.measure}</strong>
              <svg className="journey-canvas" viewBox="0 0 470 185" aria-hidden="true">
                <path className="scene-grid" d="M40 18V163 M119 18V163 M198 18V163 M277 18V163 M356 18V163 M435 18V163 M40 33H435 M40 77H435 M40 121H435"/>
                <path d={path(spines[0])} ref={spine} className="scene-spine"/>
                {journeyStages.map((stage, scene) => <g key={stage.title} data-annotation={scene} data-current={scene === active}><SceneAnnotations scene={scene} /></g>)}
                <line x1="40" y1="176" x2="435" y2="176" className="scene-track"/>
                <line x1="40" y1="176" x2="40" y2="176" className="scene-track-active" ref={progress}/>
              </svg>
            </div>
          </figure>
          <ol className="journey-steps" role="list">
            {journeyStages.map(({ title, body }, index) => {
              const TopicMark = marks[index];
              return <li data-stage={index} data-current={active === index} key={title}>
                <span><TopicMark size={20} /></span>
                <div><h3>{title}</h3><p>{body}</p>{index === 5 && <a href="#simulador">Probar el simulador de carteras</a>}</div>
              </li>;
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
