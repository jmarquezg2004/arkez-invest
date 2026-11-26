import { ArrowRight, Building2, CircuitBoard, Cloud, Code2, Cpu, Factory, Zap } from "lucide-react";
import { ArtImage } from "./art";
import type { Art } from "../catalog";
import stageData from "../ai-stages.json";

const icons = [Zap, Factory, Cpu, CircuitBoard, Building2, Cloud, Code2];
const stages = stageData.map((stage, index) => ({ ...stage, art: stage.art as Art, Icon: icons[index] }));

export function AiChain({ directory }: { directory?: React.ReactNode } = {}) {
  return <article className="ve-research ve-chain-page">
    <section className="ve-company-hero"><ArtImage art="chain" eager /><div className="ve-company-intro"><p className="ve-kicker">Ecosistemas y cadenas de valor</p><h1>De la energía a la IA</h1><p>Explora las siete etapas que conectan la infraestructura con las aplicaciones.</p>{directory && <a className="ve-cta ve-chain-map-link" href="#empresas-cadena-ia">Abrir el mapa de relaciones de IA <ArrowRight size={18} aria-hidden="true" /></a>}</div></section>
    <div className="ve-research-body">
      <h2>La cadena de valor, etapa por etapa</h2>
      <p>Selecciona una etapa para ver qué hace y qué aporta a la siguiente.</p>
      <ol className="ve-chain-track" aria-label="Etapas de infraestructura IA">{stages.map(({ title, art, Icon }, index) => <li key={title}>
        <a href={`#etapa-ia-${index + 1}`}><span className="ve-chain-art"><ArtImage art={art} /></span><Icon size={25} strokeWidth={1.7} aria-hidden="true" /><b aria-hidden="true">{index + 1}</b><span>{title}</span></a>
        {index < stages.length - 1 && <ArrowRight size={18} aria-hidden="true" />}
      </li>)}</ol>
      <div className="ve-chain-panels">
        {stages.map(({ title, detail, output, Icon }, index) => <section className="ve-chain-detail" key={title} id={`etapa-ia-${index + 1}`} tabIndex={-1} aria-labelledby={`titulo-ia-${index + 1}`}>
          <Icon size={36} aria-hidden="true" />
          <div><h3 id={`titulo-ia-${index + 1}`}>{title}</h3><p>{detail}</p><strong>{output}</strong>
            <p><a href={`/recursos/archivos/cadena-ia/etapa-ia-${index + 1}.pdf`} download>Descargar ficha de la etapa (PDF)</a></p>
            {index < stages.length - 1 && <a className="ve-chain-next" href={`#etapa-ia-${index + 2}`}>Siguiente: {stages[index + 1].title} <ArrowRight size={16} aria-hidden="true" /></a>}
          </div>
        </section>)}
      </div>
      <p className="ve-source">Secuencia educativa de funciones de la industria. Los conectores describen un flujo conceptual.</p>
      {directory}
    </div>
  </article>;
}
