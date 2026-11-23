"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ProductScene } from "./product-scenes";

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

const paths = [
  { name: "Empieza", title: "Pon el tiempo a trabajar a tu favor.", text: "Ahorro, interés compuesto, inflación y riesgo.", href: "#nx-lab-3", action: "Probar interés compuesto" },
  { name: "Aplica", title: "Compara escenarios con los mismos criterios.", text: "Seguimiento, evaluación inmobiliaria y formación en análisis.", href: "#nx-lab-0", action: "Probar el evaluador" },
  { name: "Expande", title: "Entiende la tecnología antes de adoptarla.", text: "IA aplicada y formación sobre finanzas internacionales, blockchain y tokenización.", href: "#nx-lab-1", action: "Explorar el mapa de IA" },
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
              <ProductScene variant={level} />
            </motion.div>
          </div>
        </LayoutGroup>
      </MotionConfig>
    </div>
  </section>;
}
