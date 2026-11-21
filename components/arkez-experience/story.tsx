"use client";

import { useEffect, useRef, useState } from "react";
import { AllocationMark, DocumentMark, RiskMark } from "@/components/arkez-icons";
import type { mountScrollSequence } from "./scroll-engine";

const scenes = [
  { title: "Reúne lo que tienes.", text: "Mira el capital de varias plataformas en un registro de ejemplo.", href: "#registro", action: "Probar el registro" },
  { title: "Mueve un supuesto.", text: "Compara el valor futuro y los gastos del mismo inmueble.", href: "#inmuebles", action: "Probar el evaluador" },
  { title: "Verifica lo que falta.", text: "Antes de aplicar una herramienta, revisa sus fuentes, sus supuestos y sus límites.", href: "#mapa-ia", action: "Explorar el mapa" },
];

export function ExperienceStory() {
  const stage = useRef<HTMLDivElement>(null);
  const controls = useRef<ReturnType<typeof mountScrollSequence> | null>(null);
  const active = useRef(0);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [manual, setManual] = useState(false);

  function changeStep(index: number) {
    if (index !== active.current) {
      active.current = index;
      setStep(index);
    }
  }

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const media = matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)");
    let disposed = false;
    let inView = false;
    let loading = false;
    function connect() {
      setManual(media.matches);
      if (media.matches) {
        controls.current?.dispose();
        controls.current = null;
        setPlaying(false);
        setEnhanced(false);
        setReady(true);
        return;
      }
      if (controls.current || loading || !inView || disposed || !root) return;
      setReady(false);
      loading = true;
      import("./scroll-engine").then(({ mountScrollSequence }) => {
        if (disposed || media.matches) return;
        controls.current = mountScrollSequence(root, changeStep, setPlaying);
        setEnhanced(true);
        setReady(true);
      }).catch(() => {
        if (!disposed) { setManual(true); setReady(true); }
      }).finally(() => { loading = false; });
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        inView = true;
        observer.disconnect();
        connect();
      }
    }, { rootMargin: "650px" });
    observer.observe(root);
    media.addEventListener("change", connect);
    connect();
    return () => {
      disposed = true;
      observer.disconnect();
      media.removeEventListener("change", connect);
      controls.current?.dispose();
      controls.current = null;
    };
  }, []);

  const scene = scenes[step];
  return <section className="ax-story" id="recorrido" aria-labelledby="ax-story-title">
    <div className="ax-shell">
      <div className="ax-section-title"><div><p className="ax-kicker">Una decisión en tres etapas</p><h2 id="ax-story-title">Del dato a la práctica.</h2></div><p>Desplázate para reorganizar el panel o reproduce el recorrido con el botón.</p></div>
      <div ref={stage} className="ax-story-stage" data-step={step} data-enhanced={enhanced}>
        <div className="ax-story-scene">
          <div className="ax-story-copy">
            <p>Etapa {step + 1} de 3</p>
            <h3>{scene.title}</h3>
            <p>{scene.text}</p>
            <a href={scene.href}>{scene.action}</a>
          </div>
          <div className="ax-sheet-field" aria-hidden="true">
            <div className="ax-beam" />
            <div className="ax-sheet ax-sheet-record"><DocumentMark size={25} /><span>Organiza</span><strong>3 plataformas</strong><i /><i /></div>
            <div className="ax-sheet ax-sheet-scenario"><AllocationMark size={25} /><span>Evalúa</span><strong>5 años</strong><i /><i /></div>
            <div className="ax-sheet ax-sheet-check"><RiskMark size={25} /><span>Verifica</span><strong>Fuentes y riesgos</strong><i /><i /></div>
          </div>
        </div>
        <div className="ax-story-controls">
          <button type="button" disabled={!ready} onClick={() => {
            if (manual) changeStep((active.current + 1) % scenes.length);
            else if (playing) controls.current?.pause();
            else controls.current?.play();
          }}>{manual ? "Siguiente etapa" : playing ? "Pausar secuencia" : "Reproducir secuencia"}</button>
          <button type="button" disabled={!ready} onClick={() => { changeStep(0); controls.current?.reset(); }}>Reiniciar secuencia</button>
        </div>
      </div>
    </div>
  </section>;
}
