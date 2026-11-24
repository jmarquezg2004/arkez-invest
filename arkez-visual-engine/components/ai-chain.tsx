"use client";

import { useState } from "react";
import { ArrowRight, Building2, CircuitBoard, Cloud, Code2, Cpu, Factory, Zap } from "lucide-react";
import { ArtImage } from "./art";

const stages = [
  { title: "Energía y red", art: "energy", detail: "La generación, la transmisión y el enfriamiento sostienen la demanda eléctrica del cómputo.", output: "Energía disponible y estable", Icon: Zap },
  { title: "Equipos y EDA", art: "security", detail: "Las herramientas de diseño electrónico y los equipos de producción preparan el paso del plano al silicio.", output: "Diseños verificables y procesos de producción", Icon: Factory },
  { title: "Diseño de chips", art: "chip", detail: "Las arquitecturas de cómputo deciden cómo se procesan los datos, con qué velocidad y cuánto consumo.", output: "Planos de CPU, GPU y aceleradores", Icon: Cpu },
  { title: "Fabricación y memoria", art: "chip", detail: "La fabricación, el empaquetado y la memoria integran los componentes en un producto físico.", output: "Chips y módulos listos para integrar", Icon: CircuitBoard },
  { title: "Servidores y redes", art: "chain", detail: "Los equipos combinan chips, memoria y redes para transferir datos entre muchas máquinas.", output: "Capacidad de cómputo conectada", Icon: Building2 },
  { title: "Centros de datos y nube", art: "security", detail: "La infraestructura aloja, mantiene y ofrece cómputo que otros equipos pueden solicitar.", output: "Cómputo disponible para entrenar o servir modelos", Icon: Cloud },
  { title: "Modelos y aplicaciones", art: "study", detail: "El software aplica los modelos a tareas y flujos concretos como resumir o clasificar información.", output: "Herramientas para personas y empresas", Icon: Code2 },
] as const;

export function AiChain() {
  const [selected, setSelected] = useState(0);
  const { title, detail, output, Icon } = stages[selected];
  return <article className="ve-research ve-chain-page">
    <section className="ve-company-hero"><ArtImage art="chain" eager /><div className="ve-company-intro"><p className="ve-kicker">Ecosistemas y cadenas de valor</p><h1>De la energía a la IA</h1><p>Explora las siete etapas que conectan la infraestructura con las aplicaciones.</p></div></section>
    <div className="ve-research-body">
      <h2>La cadena de valor, etapa por etapa</h2>
      <ol className="ve-chain-track" aria-label="Etapas de infraestructura IA">{stages.map(({ title: label, art, Icon: Symbol }, index) => <li key={label} data-tone={index}>
        <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="ve-chain-art"><ArtImage art={art} /></span><Symbol size={25} strokeWidth={1.7} /><b>{index + 1}</b><span>{label}</span></button>
        {index < stages.length - 1 && <ArrowRight size={18} aria-hidden="true" />}
      </li>)}</ol>
      <div className="ve-chain-detail" aria-live="polite"><Icon size={36} /><div><h3>{title}</h3><p>{detail}</p><strong>{output}</strong></div></div>
      <p className="ve-source">Secuencia educativa de funciones de la industria. Los conectores describen un flujo conceptual.</p>
    </div>
  </article>;
}
