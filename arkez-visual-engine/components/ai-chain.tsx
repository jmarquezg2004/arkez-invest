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
  return <article className="ve-research ve-chain-page">
    <section className="ve-company-hero"><ArtImage art="chain" eager /><div className="ve-company-intro"><p className="ve-kicker">Ecosistemas y cadenas de valor</p><h1>De la energía a la IA</h1><p>Explora las siete etapas que conectan la infraestructura con las aplicaciones.</p></div></section>
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
            {index < stages.length - 1 && <a className="ve-chain-next" href={`#etapa-ia-${index + 2}`}>Siguiente: {stages[index + 1].title} <ArrowRight size={16} aria-hidden="true" /></a>}
          </div>
        </section>)}
      </div>
      <p className="ve-source">Secuencia educativa de funciones de la industria. Los conectores describen un flujo conceptual.</p>
    </div>
  </article>;
}
