"use client";

import { useState } from "react";
import { ArrowRight, InsightMark, MoveUpRight, ScenarioMark, TechnologyMark } from "@/components/arkez-icons";
import { aiNodes, aiRelations } from "@/lib/experience-ai";

const icons = [TechnologyMark, ScenarioMark, InsightMark, ArrowRight];

export function AiMap() {
  const [active, select] = useState<(typeof aiNodes)[number]["id"]>("cloud");
  const node = aiNodes.find(({ id }) => id === active)!;
  const relations = aiRelations.filter(({ from, to }) => from === active || to === active);
  const related = new Set(relations.flatMap(({ from, to }) => [from as string, to as string]));

  return <section className="ax-map" id="mapa-ia" aria-labelledby="ax-map-title">
    <div className="ax-shell">
      <div className="ax-section-title"><div><p className="ax-kicker">Expande · Infraestructura IA</p><h2 id="ax-map-title">¿Qué hay detrás de una respuesta?</h2></div><p>Selecciona una categoría para ver sus conexiones y consultar la documentación.</p></div>
      <div className="ax-map-panel">
        <ol className="ax-map-nodes" role="list" aria-label="Categorías de infraestructura">
          {aiNodes.map(({ id, title, product }, index) => {
            const Icon = icons[index];
            return <li key={id} data-related={related.has(id)}>
              <button aria-pressed={id === active} aria-controls="ax-map-details" type="button" onClick={() => select(id)}>
                <Icon size={29} /><span><strong>{title}</strong><small>{product}</small></span>
              </button>
            </li>;
          })}
        </ol>
        <div className="ax-map-detail" id="ax-map-details">
          <div role="status"><h3>{node.title}</h3><p>{node.note}</p></div>
          <ul role="list">{relations.map(({ label, explanation, url, source }) => (
            <li key={url}><strong>{label}</strong><p>{explanation}</p><a href={url}>{source}<MoveUpRight size={14} /></a></li>
          ))}</ul>
        </div>
      </div>
      <p className="ax-map-note">Cada conexión es independiente y tiene su propia fuente. El mapa enlaza ejemplos técnicos entre categorías, no una cadena operativa ni acuerdos comerciales.</p>
    </div>
  </section>;
}
