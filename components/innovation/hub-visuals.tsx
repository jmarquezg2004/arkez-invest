import { ArrowDown, ArrowRight, BookOpen, BrainCircuit, Boxes, ChartNoAxesCombined, CircleDot, FileCheck2, GitBranch, GraduationCap, Layers3, Network, ScanLine, ShieldCheck, Users } from "lucide-react";
import type { InnovationTopic } from "@/lib/innovation";

const signals = [
  { label: "Mercados", text: "Precios y volúmenes", icon: ChartNoAxesCombined },
  { label: "Inteligencia artificial", text: "Investigación asistida", icon: BrainCircuit },
  { label: "Blockchain", text: "Registro y trazabilidad", icon: Network },
  { label: "Activos tokenizados", text: "Derechos y custodia", icon: Layers3 },
];

export function InnovationMap() {
  return (
    <figure className="hub-map" data-reveal>
      <figcaption><CircleDot size={16} aria-hidden="true" /> Cómo se conectan las tecnologías y los portafolios</figcaption>
      <div className="hub-map-grid">
        <svg className="hub-map-paths" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M146 22 V90 Q146 119 180 119 H300 M454 22 V90 Q454 119 420 119 H300 M146 189 V148 Q146 119 180 119 M454 189 V148 Q454 119 420 119 M300 119 V219" />
          <circle cx="300" cy="119" r="6" />
        </svg>
        {signals.map(({ label, text, icon: Icon }) => (
          <div className="hub-map-node" key={label}>
            <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
            <div><strong>{label}</strong><span>{text}</span></div>
          </div>
        ))}
      </div>
      <div className="hub-map-core"><GitBranch size={23} aria-hidden="true" /><div><strong>Portafolios diversificados</strong><span>Exposición, costos y escenarios</span></div></div>
    </figure>
  );
}

const topicIcons = {
  portafolios: [Boxes, FileCheck2, ShieldCheck, Layers3],
  defi: [ScanLine, FileCheck2, Network, CircleDot],
  ia: [BookOpen, BrainCircuit, ScanLine, ShieldCheck],
  academia: [BookOpen, GraduationCap, ChartNoAxesCombined, FileCheck2],
  ecosistema: [CircleDot, BookOpen, Users, ChartNoAxesCombined],
};

export function TopicDiagram({ topic }: { topic: InnovationTopic }) {
  return (
    <figure className="hub-diagram">
      <figcaption>{topic.visual}</figcaption>
      <ol role="list">
        {topic.steps.map((step, index) => {
          const Icon = topicIcons[topic.id][index];
          return <li key={step}><Icon size={23} strokeWidth={1.55} aria-hidden="true" /><span>{step}</span>
            {index < topic.steps.length - 1 && <>
              <ArrowRight className="hub-flow-arrow" size={18} aria-hidden="true" />
              <ArrowDown className="hub-flow-down" size={15} aria-hidden="true" />
            </>}
          </li>;
        })}
      </ol>
    </figure>
  );
}
