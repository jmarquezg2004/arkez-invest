"use client";

import { useEffect, useId, useState } from "react";
import data from "../ai-map-source.json";

const stages = ["Energía", "Equipos y EDA", "Diseño", "Fabricación", "Servidores", "Nube", "Modelos", "Transversales"];
const stageColors = ["#fbb846", "#a6b4c6", "#37c9e5", "#78aaff", "#f188bd", "#56d6a3", "#bd97ff", "#e1d8c1"];
const relations: Record<string, { label: string; color: string; dash?: string }> = {
  supply: { label: "Suministra", color: "#9aa9bd" },
  contract: { label: "Cómputo", color: "#38bdf8" },
  invest: { label: "Financia", color: "#fbbf24", dash: "7 4" },
  energy: { label: "Energía", color: "#fb923c" },
  monetize: { label: "Monetización", color: "#e879f9", dash: "3 4" },
  alliance: { label: "Alianza", color: "#bef264", dash: "2 4" },
  compete: { label: "Competencia", color: "#fb7185", dash: "1 5" },
};

export function AiRelationGraph() {
  const marker = useId();
  const [stage, setStage] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [hover, setHover] = useState("");
  const [signals, setSignals] = useState(false);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const company = new URLSearchParams(window.location.search).get("empresa");
    if (company && data.nodes.some(({ id }) => id === company)) {
      setQuery(company);
      setSelected(company);
    }
  }, []);
  const matches = data.nodes.filter(({ id, name, stage: group }) => (!stage || stage === group)
    && `${id} ${name}`.toLowerCase().includes(query.trim().toLowerCase()));
  const focus = hover || selected || (query.trim() ? matches[0]?.id : "");
  const activeNodes = new Set(matches.map(({ id }) => id));
  const edges = data.edges.filter(({ from, to, type: kind }) => (!type || type === kind) && (activeNodes.has(from) || activeNodes.has(to)));
  const related = edges.filter(({ from, to }) => from === focus || to === focus);
  const neighbors = new Set(related.flatMap(({ from, to }) => [from, to]));
  const target = data.nodes.find(({ id }) => id === focus);
  return <div className="ve-map-workspace">
    <div className="ve-map-controls">
      <label>Empresa o ticker<input type="search" value={query} placeholder="Ej. NVDA" onChange={(event) => { setSelected(""); setQuery(event.target.value); }} /></label>
      <label>Etapa<select value={stage} onChange={(event) => { setSelected(""); setStage(event.target.value); }}><option value="">Todas</option>{stages.map((label, i) => <option key={label} value={i === 7 ? "T" : i + 1}>{label}</option>)}</select></label>
      <label>Relación<select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todas</option>{Object.entries(relations).map(([id, relation]) => <option key={id} value={id}>{relation.label}</option>)}</select></label>
      <button type="button" aria-pressed={signals} onClick={() => setSignals(!signals)}>Señales de flujo</button>
      <button type="button" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? "Reducir mapa" : "Ampliar mapa"}</button>
      <button type="button" onClick={() => { setStage(""); setType(""); setQuery(""); setSelected(""); setZoom(false); setSignals(false); }}>Reiniciar</button>
    </div>
    <ul className="ve-map-legend" aria-label="Tipos de línea">{Object.entries(relations).map(([id, relation]) => <li key={id}><button type="button" aria-pressed={type === id} onClick={() => setType(type === id ? "" : id)}><svg width="23" height="12" aria-hidden="true"><path d="M1 6H22" stroke={relation.color} strokeDasharray={relation.dash} strokeWidth="2" /></svg>{relation.label}</button></li>)}</ul>
    <div className="ve-map-layout">
      <div className="ve-map-canvas" tabIndex={0} aria-label="Área desplazable de la red">
        <svg className="ve-map-svg" data-zoom={zoom} viewBox="0 0 1000 685" aria-label="Red interactiva de empresas y relaciones">
          <defs>{Object.entries(relations).map(([id, relation]) => <marker key={id} id={marker + id} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5 0 5Z" fill={relation.color} /></marker>)}</defs>
          {edges.map(({ from, to, type: kind }, index) => {
            const a = data.nodes.find(({ id }) => id === from)!;
            const b = data.nodes.find(({ id }) => id === to)!;
            const relation = relations[kind];
            const angle = Math.atan2(b.y - a.y, b.x - a.x);
            const endX = b.x - 13 * Math.cos(angle);
            const endY = b.y - 13 * Math.sin(angle);
            const highlighted = from === focus || to === focus;
            return <line className={signals && kind !== "compete" && (!focus || highlighted) ? "ve-map-signal" : undefined}
              key={index} x1={a.x} y1={a.y} x2={endX} y2={endY} stroke={relation.color} strokeDasharray={relation.dash}
              strokeWidth={highlighted ? 2.6 : 1.15} opacity={focus ? highlighted ? 1 : .12 : .56} markerEnd={kind === "compete" ? undefined : `url(#${marker + kind})`} />;
          })}
          {data.nodes.filter(({ id }) => activeNodes.has(id) || neighbors.has(id)).map(({ id, x, y, name, stage: group, kind }) =>
            <g key={id} transform={`translate(${x} ${y})`} role="button" tabIndex={0} aria-label={name + " · " + id} aria-pressed={selected === id}
              opacity={!focus || focus === id || neighbors.has(id) ? 1 : .42}
              onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover("")} onClick={() => setSelected(id)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(id); } }}>
              <circle r={focus === id ? 14 : 11} fill="#121d30" stroke={stageColors[group === "T" ? 7 : Number(group) - 1]} strokeDasharray={kind !== 1 ? "3 2" : undefined} strokeWidth={focus === id ? 3 : 1.8} />
              <text y="25" textAnchor="middle">{id}</text>
            </g>)}
        </svg>
      </div>
      <aside className="ve-map-details" aria-live="polite">
        <h3>{target?.name ?? "Explora las conexiones"}</h3>
        {target ? <><p>{related.length} conexiones visibles</p><ul>{related.map(({ from, to, type: kind, description }, i) =>
          <li key={i}><strong>{from} {kind === "compete" ? "·" : "→"} {to}</strong><small>{relations[kind].label} · {description}</small></li>)}</ul></>
          : <p>{matches.length ? `${matches.length} nodos y ${edges.length} conexiones visibles. Selecciona una empresa para ver sus relaciones.` : "No hay nodos que coincidan con la búsqueda."}</p>}
      </aside>
    </div>
    <p>Relaciones del mapa histórico aportado por Arkez. Consulta las fuentes primarias disponibles en el directorio de abajo antes de usar una relación como dato vigente.</p>
  </div>;
}
