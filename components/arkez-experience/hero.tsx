"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from "motion/react";
import { AllocationMark, ArrowRight, BusinessMark, ChainMark, EducationMark } from "@/components/arkez-icons";
import { calculateCompound, compoundExample } from "@/lib/compound-interest";
import { tiers } from "@/lib/experience-products";
import { money } from "./format";
import prisma from "./prisma.webp";
import prismaMobile from "./prisma-movil.webp";

const savings = calculateCompound(compoundExample);
const icons = [EducationMark, AllocationMark, BusinessMark];

function LevelVisual({ level }: { level: number }) {
  if (level === 0) {
    const max = savings.final.balance;
    const path = savings.rows.map(({ year, balance }) => `${year ? "L" : "M"}${18 + year * 22} ${95 - balance / max * 72}`).join(" ");
    return <>
      <span>Escenario de ahorro · ficticio</span>
      <strong>{money.format(max)}</strong>
      <svg viewBox="0 0 260 105" className="ax-mini-plot" role="img" aria-label="Capital de ejemplo proyectado a diez años">
        <path className="ax-grid" d="M18 24H238 M18 47H238 M18 71H238 M18 95H238" />
        <path className="ax-fill" d={`${path} V95 H18 Z`} /><path className="ax-line" d={path} /><circle cx="238" cy="23" r="4" />
      </svg>
      <small>10 años · tasa nominal de ejemplo del 6 %</small>
    </>;
  }
  if (level === 1) return <>
    <span>Registro en varias plataformas · ficticio</span>
    <strong>{money.format(9_700_000)}</strong>
    <div className="ax-mini-ledger"><span>Plataforma A</span><b>COP 4,8 M</b><span>Plataforma B</span><b>COP 3,2 M</b><span>Plataforma C</span><b>COP 1,7 M</b></div>
    <small>Tres posiciones en un solo lugar</small>
  </>;
  return <>
    <span>Infraestructura para procesos con IA</span>
    <strong>De la nube a la herramienta</strong>
    <div className="ax-mini-nodes">
      <span>Google Cloud</span><ArrowRight size={16} /><span>vLLM</span><ArrowRight size={16} /><span>Aplicación</span>
    </div>
    <small>Relaciones técnicas con fuentes en el mapa</small>
  </>;
}

export function ExperienceHero() {
  const [level, setLevel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const tier = tiers[level];
  const Icon = icons[level];

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPlaying(false);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function play() {
    stop();
    if (reduced) {
      setLevel((level + 1) % tiers.length);
      return;
    }
    setPlaying(true);
    setLevel(0);
    function advance(index: number) {
      timer.current = setTimeout(() => {
        setLevel(index);
        if (index + 1 < tiers.length) advance(index + 1);
        else stop();
      }, 1450);
    }
    advance(1);
  }

  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 2
      : event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : null;
    if (next === null) return;
    event.preventDefault();
    stop();
    setLevel(next);
    document.getElementById(`ax-level-${next}`)?.focus();
  }

  return <section className="ax-hero" aria-labelledby="ax-title">
    <div className="ax-hero-scene">
      <picture className="ax-hero-art" aria-hidden="true">
        <source media="(max-width: 650px)" srcSet={prismaMobile.src} />
        <img src={prisma.src} width={prisma.width} height={prisma.height} alt="" fetchPriority="high" />
      </picture>
      <div className="ax-shell ax-hero-copy">
        <p className="ax-kicker">Educación, formación y consultoría</p>
        <h1 id="ax-title">Entiende tu dinero. Aprende a invertir. <em>Aprovecha la tecnología.</em></h1>
        <p>Prueba decisiones financieras con ejemplos y aprende a evaluar las herramientas que ya existen.</p>
        <a className="ax-primary" href="#caminos-arkez">Explorar los tres caminos<ArrowRight size={17} /></a>
      </div>
    </div>
    <div className="ax-shell ax-hero-grid" id="caminos-arkez">
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 190, damping: 27 }}>
        <LayoutGroup id="arkez-paths">
          <div className="ax-console">
            <div className="ax-console-head"><span><ChainMark size={16} /> Laboratorio Arkez</span><small>Prototipo educativo</small></div>
            <div className="ax-tabs" role="tablist" aria-label="Elige tu camino">
              {tiers.map(({ name }, index) => <button type="button" role="tab" id={`ax-level-${index}`} key={name}
                aria-controls="ax-level-panel" aria-selected={level === index} tabIndex={level === index ? 0 : -1}
                onKeyDown={(event) => keyboard(event, index)} onClick={() => { stop(); setLevel(index); }}>
                {level === index && <motion.span className="ax-tab-indicator" layoutId="selected-path" aria-hidden="true" />}
                <span>{name}</span>
              </button>)}
            </div>
            <div id="ax-level-panel" className="ax-workspace" data-level={level} role="tabpanel" aria-labelledby={`ax-level-${level}`}>
              <motion.div layout={reduced ? false : "position"} className="ax-path-intro">
                <span><Icon size={18} /> {tier.audience}</span><h2>{tier.title}</h2><p>{tier.benefit}</p>
              </motion.div>
              <motion.div layout={reduced ? false : "position"} className="ax-path-visual">
                <LevelVisual level={level} />
              </motion.div>
              <motion.ul layout={reduced ? false : "position"} className="ax-path-products" role="list">
                {tier.tools.map(({ label, href }) => <li key={label}><a href={href}>{label}<ArrowRight size={14} /></a></li>)}
              </motion.ul>
            </div>
            <div className="ax-play-controls">
              <button type="button" onClick={playing ? stop : play}>{playing ? "Pausar recorrido" : "Reproducir cambios"}</button>
              <button type="button" onClick={() => { stop(); setLevel(0); }}>Reiniciar caminos</button>
            </div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </div>
  </section>;
}
