import { ArrowRight } from "lucide-react";
import { MarketTrace } from "@/components/charts/financial-graphics";
import type { InnovationTopic } from "@/lib/innovation";
import { academyPath, ecosystemPaths } from "@/lib/innovation-modules";
import { InstrumentControl } from "./instrument-control";

export function InnovationArtwork({ priority = false }: { priority?: boolean }) {
  return (
    <figure className="innovation-artwork">
      <figcaption className="sr-only">Serie ficticia de mercado: el índice pasa de 100 a 115 puntos.</figcaption>
      <img src="/brand/estratos-900.webp" srcSet="/brand/estratos-580.webp 580w, /brand/estratos-900.webp 900w" sizes="(max-width: 760px) 94vw, 48vw" width="900" height="600" alt="" fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : "lazy"} />
      <div className="artwork-trace">
        <p className="artwork-caption">Lectura de una señal <span>Datos ficticios</span></p>
        <MarketTrace readings={[100, 106, 104, 113, 109, 115]} />
        <p>100 → 115 <span>puntos de índice</span></p>
      </div>
    </figure>
  );
}

export function TopicDiagram({ topic }: { topic: InnovationTopic }) {
  return (
    <figure className="hub-instrument">
      <figcaption>{topic.visual}</figcaption>
      {topic.id === "academia" ? (
        <ol className="instrument-path" role="list">
          {academyPath.map(({ level, aim, label, href }) => <li key={href}>
            <span>{level}</span><p>{aim}</p><a href={href}>{label}<ArrowRight size={15} aria-hidden="true" /></a>
          </li>)}
        </ol>
      ) : topic.id === "ecosistema" ? (
        <ul className="instrument-path" role="list">
          {ecosystemPaths.map(({ step, aim, label, href }) => <li key={href}>
            <span>{step}</span><p>{aim}</p><a href={href}>{label}<ArrowRight size={15} aria-hidden="true" /></a>
          </li>)}
        </ul>
      ) : <InstrumentControl kind={topic.id} />}
      <p className="instrument-sequence">{topic.steps.join(" → ")}</p>
    </figure>
  );
}
