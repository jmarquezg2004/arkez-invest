"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { ArrowRight, BusinessMark, EducationMark, TechnologyMark } from "@/components/arkez-icons";

// The useScrolled hook is adapted from Hirael NexaCore (MIT), see HIRAEL-LICENSE.txt.
const useScrolled = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
};

export function FloatingNav() {
  const compact = useScrolled(96);
  const nav = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<"caminos" | "herramientas" | null>(null);
  const [mobile, setMobile] = useState(false);
  function close() { setOpen(null); setMobile(false); }
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !nav.current?.contains(event.target)) {
        setOpen(null); setMobile(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return <nav ref={nav} className="nx-nav" data-compact={compact} aria-label="Navegación del prototipo" onKeyDown={(event) => {
    if (event.key !== "Escape" || (!open && !mobile)) return;
    const controlled = open ? `nx-trigger-${open}` : "nx-mobile";
    close();
    document.getElementById(controlled)?.focus();
  }}>
    <a className="nx-brand" href="#nx-title"><img src="/brand/logo.webp" alt="Arkez Invest" width="130" height="44" /></a>
    <button id="nx-mobile" type="button" className="nx-mobile-toggle" aria-expanded={mobile} aria-controls="nx-nav-panel" onClick={() => { setMobile(!mobile); setOpen(null); }}>{mobile ? "Cerrar" : "Menú"}</button>
    <div id="nx-nav-panel" className="nx-nav-panel" data-open={mobile}>
      <a onClick={close} href="#nx-servicios">Servicios</a>
      <a onClick={close} href="#nx-metodo">Método</a>
      <div className="nx-nav-group">
        <button id="nx-trigger-caminos" type="button" aria-expanded={open === "caminos"} aria-controls="nx-menu-caminos" onClick={() => setOpen(open === "caminos" ? null : "caminos")}>Caminos <span aria-hidden="true">⌄</span></button>
        <div id="nx-menu-caminos" className="nx-menu" hidden={open !== "caminos"}>
          {["Empieza", "Aplica", "Expande"].map((name, index) => <a key={name} href={`#nx-nivel-${index}`} onClick={close}>{name}</a>)}
        </div>
      </div>
      <div className="nx-nav-group">
        <button id="nx-trigger-herramientas" type="button" aria-expanded={open === "herramientas"} aria-controls="nx-menu-herramientas" onClick={() => setOpen(open === "herramientas" ? null : "herramientas")}>Herramientas <span aria-hidden="true">⌄</span></button>
        <div id="nx-menu-herramientas" className="nx-menu" hidden={open !== "herramientas"}>
          {["Evaluador inmobiliario", "Infraestructura IA", "Panel de inversiones", "Interés compuesto"].map((name, index) => <a key={name} href={`#nx-lab-${index}`} onClick={close}>{name}</a>)}
        </div>
      </div>
      <a className="nx-nav-contact" href="/contacto/">Contacto <ArrowRight size={15} /></a>
    </div>
  </nav>;
}

const services = [
  { tag: "Aprender", title: "Formación financiera", description: "Presupuesto, inflación, riesgo e inversión en ejercicios guiados.", href: "/servicios/educacion-financiera/", Icon: EducationMark, glyph: 0 },
  { tag: "Practicar", title: "Análisis y simulación", description: "Lee indicadores y contrasta supuestos con herramientas educativas.", href: "/servicios/analisis-de-mercados/", Icon: TechnologyMark, glyph: 1 },
  { tag: "Decidir", title: "Consultoría para equipos", description: "Organiza una decisión financiera y evalúa las herramientas que encajan.", href: "/servicios/consultoria-financiera/", Icon: BusinessMark, glyph: 2 },
] as const;

function ServiceGraphic({ variant }: { variant: number }) {
  return <svg viewBox="0 0 360 210" aria-hidden="true" className="nx-service-graphic">
    <path d="M24 45H336M24 85H336M24 125H336M24 165H336M52 23V186M116 23V186M180 23V186M244 23V186M308 23V186" className="nx-svg-grid" />
    {variant === 0 ? <><path d="M50 145l64-11 62-29 64-37 67-24M50 145l64-5 62-11 64-16 67-26M50 145l64 0 62-4 64-5 67-13" /><circle cx="307" cy="44" r="5" /></>
      : variant === 1 ? <><path d="M50 158l53-48 44 19 48-62 44 26 67-59M50 137l53-12 44 14 48-31 44 17 67-25" /><circle cx="195" cy="67" r="5" /></>
      : <><path d="M57 55h92v47H57zm151 62h97v47h-97zM149 78h73v38M102 102v38h106M256 117V74h48" /><circle cx="304" cy="74" r="5" /></>}
  </svg>;
}

// Adapts the upstream ServiceCard translate/reveal structure for mouse, keyboard and touch.
export function ServiceDeck() {
  const [selected, setSelected] = useState(0);
  return <section className="nx-services nx-pad" id="nx-servicios" aria-labelledby="nx-services-title">
    <div className="nx-wrap">
      <header className="nx-heading"><p className="nx-kicker">Servicios</p><h2 id="nx-services-title">Del concepto a la decisión.</h2></header>
      <div className="nx-services-grid">
        {services.map(({ tag, title, href, description, Icon, glyph }, index) => <article key={tag} className="nx-service" data-expanded={selected === index} onPointerEnter={(event) => { if (event.pointerType === "mouse") setSelected(index); }}>
          <ServiceGraphic variant={glyph} />
          <div className="nx-service-content">
            <p className="nx-service-tag"><Icon size={17} />{tag}</p>
            <h3><button type="button" aria-expanded={selected === index} aria-controls={`nx-service-${index}`} onClick={() => setSelected(selected === index ? -1 : index)}>{title}<span aria-hidden="true">{selected === index ? "−" : "+"}</span></button></h3>
            <div className="nx-service-reveal" id={`nx-service-${index}`} inert={selected !== index}><div><p>{description}</p><a href={href}>Explorar servicio <ArrowRight size={16} /></a></div></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

const fragments = [
  ["Ahorros", "Plataforma A", "4,2 M"], ["Inversiones", "Plataforma B", "6,8 M"], ["Gastos", "Registro mensual", "1,2 M"],
] as const;

export function Comparison() {
  const [unified, setUnified] = useState(false);
  return <section className="nx-compare nx-pad" aria-labelledby="nx-compare-title">
    <div className="nx-wrap nx-compare-layout">
      <header className="nx-heading">
        <p className="nx-kicker">Antes y después</p><h2 id="nx-compare-title">De datos dispersos a una lectura clara.</h2>
        <p>Reúne capital y gastos en una sola vista para saber qué puedes comparar antes de decidir.</p>
        <div className="nx-switch nx-switch-compare" role="group" aria-label="Organización de la información">
          <button type="button" aria-pressed={!unified} onClick={() => setUnified(false)}>Dispersa</button>
          <button type="button" aria-pressed={unified} onClick={() => setUnified(true)}>Organizada</button>
        </div>
      </header>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="nx-comparison">
          <div className="nx-compare-scene" data-unified={unified}>
            <div className="nx-compare-meta"><strong>{unified ? "Posición consolidada" : "Tres registros separados"}</strong><small>Ejemplo ficticio · COP</small></div>
            {fragments.map(([title, source, sum]) => <motion.div key={title} className="nx-fragment" layout="position">
              <div><strong>{title}</strong><small>{source}</small></div><b>{sum}</b>
            </motion.div>)}
            <p className="nx-compare-total" aria-live="polite">{unified ? "Capital combinado: COP 11 M · Gastos: COP 1,2 M" : "Selecciona Organizada para distinguir capital de gastos."}</p>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </div>
  </section>;
}

const stages = [
  ["Comprende", "Distingue capital, ingresos, gastos y riesgo.", EducationMark],
  ["Explora", "Consulta fuentes y compara alternativas.", TechnologyMark],
  ["Simula", "Cambia un supuesto y observa el efecto.", BusinessMark],
  ["Aplica", "Define un criterio para la próxima decisión.", ArrowRight],
] as const;

// The ascending staircase and narrow-screen stack adapt NexaCore Precision (MIT).
export function LearningStages() {
  const panel = useRef<HTMLDivElement>(null);
  const replay = useRef<(() => void) | null>(null);
  useEffect(() => {
    const scene = panel.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!scene || preference.matches) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = scene.querySelectorAll(".nx-step");
        const timeline = gsap.timeline({ paused: true }).fromTo(cards, { y: 30, rotate: -3 }, { y: 0, rotate: 0, stagger: .23, duration: .58 }, 0)
          .fromTo(".nx-step-line", { scaleX: 0 }, { scaleX: 1, duration: 1.3 }, 0);
        const trigger = ScrollTrigger.create({ trigger: scene, start: "top 86%", end: "bottom 68%", animation: timeline, scrub: .55 });
        replay.current = () => {
          trigger.disable(false);
          timeline.restart().eventCallback("onComplete", () => { trigger.enable(); timeline.eventCallback("onComplete", null); });
        };
        return () => { replay.current = null; };
      }, scene);
      dispose = () => media.revert();
    });
    return () => { disposed = true; dispose?.(); };
  }, []);

  return <section className="nx-method nx-pad" id="nx-metodo" aria-labelledby="nx-method-title">
    <div className="nx-wrap">
      <header className="nx-heading">
        <p className="nx-kicker">Método Arkez</p><h2 id="nx-method-title">Cuatro pasos para aplicar lo aprendido.</h2>
        <button type="button" className="nx-replay" onClick={() => replay.current?.()}>Reproducir secuencia <span aria-hidden="true">↗</span></button>
      </header>
      <div ref={panel} className="nx-step-stage"><div className="nx-step-line" aria-hidden="true" />
        <ol className="nx-steps">{stages.map(([title, description, Icon]) => <li key={title} className="nx-step"><Icon size={24} /><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </div>
    </div>
  </section>;
}

const paths = [
  { name: "Empieza", title: "Pon el tiempo a trabajar a tu favor.", text: "Ahorro, interés compuesto, inflación y riesgo.", href: "#nx-lab-3", action: "Probar interés compuesto", figure: "Diez años de ahorro", measure: "Aportes y crecimiento" },
  { name: "Aplica", title: "Compara escenarios con los mismos criterios.", text: "Seguimiento, evaluación inmobiliaria y formación en análisis.", href: "#nx-lab-0", action: "Probar el evaluador", figure: "Proyección inmobiliaria", measure: "Ingresos, gastos e inflación" },
  { name: "Expande", title: "Entiende la tecnología antes de adoptarla.", text: "IA aplicada y formación sobre finanzas internacionales, blockchain y tokenización.", href: "#nx-lab-1", action: "Explorar el mapa de IA", figure: "Infraestructura de IA", measure: "Cómputo, nube e inferencia" },
] as const;

export function useHashSelection(prefix: string, select: (index: number) => void, length: number) {
  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      if (!hash.startsWith(prefix)) return;
      const index = Number(hash.slice(prefix.length));
      if (Number.isInteger(index) && index >= 0 && index < length) select(index);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [prefix, select, length]);
}


export function PathExplorer() {
  const [level, setLevel] = useState(0);
  useHashSelection("nx-nivel-", setLevel, paths.length);
  const path = paths[level];
  return <section className="nx-paths nx-pad" id="nx-caminos" aria-labelledby="nx-path-title">
    <div className="nx-wrap">
      <header className="nx-heading"><p className="nx-kicker">Formación financiera</p><h2 id="nx-path-title">Encuentra tu punto de partida.</h2></header>
      <div className="nx-switch" role="group" aria-label="Niveles de formación">
        {paths.map(({ name }, index) => <button id={`nx-nivel-${index}`} key={name} type="button" aria-pressed={index === level} onClick={() => setLevel(index)}>{name}</button>)}
      </div>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="nx-paths">
          <div className="nx-path-body" data-level={level}>
            <motion.div layout="position" className="nx-path-copy">
              <h3>{path.title}</h3><p>{path.text}</p><a className="nx-button nx-button-light" href={path.href}>{path.action}<ArrowRight size={16} /></a>
            </motion.div>
            <motion.div layout="position" className="nx-path-visual">
              <strong>{path.figure}</strong><small>{path.measure}</small><ServiceGraphic variant={level} />
            </motion.div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </div>
  </section>;
}
