"use client";

import { useEffect, useRef, useState } from "react";
import { Background, Handle, MarkerType, Position, ReactFlow, useNodesInitialized, useReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import { ArrowUpRight, Boxes, Cloud, Cpu, Minus, Plus, Route, Search, Terminal, Scan } from "lucide-react";
import { aiNodes, aiRelations } from "@/lib/experience-ai";

const layers = ["Cómputo", "Nube", "Inferencia", "Aplicaciones"];
const entries = [
  { id: "nvidia", company: "NVIDIA", tech: "H100", layer: 0, note: aiNodes[0].note, Icon: Cpu },
  { id: "aws", company: "Amazon Web Services", tech: "EC2 P5", layer: 1, note: "Las instancias EC2 P5 ofrecen aceleradores para ejecutar cargas de IA.", Icon: Cloud },
  { id: "google", company: "Google Cloud", tech: "Modelos abiertos", layer: 1, note: "Google Cloud documenta cómo alojar y servir modelos abiertos usando vLLM.", Icon: Cloud },
  { id: "vllm", company: "vLLM", tech: "Motor de inferencia", layer: 2, note: aiNodes[2].note, Icon: Boxes },
  { id: "api", company: "Cliente API", tech: "HTTP", layer: 3, note: aiNodes[3].note, Icon: Terminal },
] as const;
type Entry = typeof entries[number];
const connections = [
  { from: "nvidia", to: "aws", kind: "Oferta de producto documentada", solid: true, source: aiRelations[0] },
  { from: "google", to: "vllm", kind: "Integración técnica documentada", solid: false, source: aiRelations[1] },
  { from: "vllm", to: "api", kind: "Interfaz técnica documentada", solid: false, source: aiRelations[2] },
] as const;
const checked = "2026-11-23";

type InfrastructureNode = Node<{ entry: Entry; active: boolean; muted: boolean; compact: boolean; onInspect: (id: Entry["id"]) => void }, "infrastructure">;

function Infrastructure({ data }: NodeProps<InfrastructureNode>) {
  const { entry, active, muted, compact, onInspect } = data;
  return <div className="nx-infra-node" data-layer={entry.layer} data-active={active} data-muted={muted}>
    <Handle type="target" position={compact ? Position.Top : Position.Left} isConnectable={false} />
    <button type="button" className="nodrag nopan" onFocus={() => onInspect(entry.id)} onMouseEnter={() => onInspect(entry.id)} onClick={() => onInspect(entry.id)} aria-pressed={active}>
      <span className="nx-infra-symbol"><entry.Icon size={23} strokeWidth={1.65} /></span>
      <small>{layers[entry.layer]}</small><strong>{entry.company}</strong><span>{entry.tech}</span>
    </button>
    <Handle type="source" position={compact ? Position.Bottom : Position.Right} isConnectable={false} />
  </div>;
}
const nodeTypes = { infrastructure: Infrastructure };

function MapControls({ signal }: { signal: string }) {
  const flow = useReactFlow();
  const ready = useNodesInitialized();
  useEffect(() => {
    if (!ready) return;
    const frame = requestAnimationFrame(() => void flow.fitView({ padding: .12, maxZoom: 1 }));
    return () => cancelAnimationFrame(frame);
  }, [ready, signal, flow]);
  return <div className="nx-infra-controls nopan" role="group" aria-label="Vista del mapa">
    <button type="button" aria-label="Acercar mapa" onClick={() => void flow.zoomIn()}><Plus size={17} /></button>
    <button type="button" aria-label="Alejar mapa" onClick={() => void flow.zoomOut()}><Minus size={17} /></button>
    <button type="button" aria-label="Recentrar mapa" onClick={() => void flow.fitView({ padding: .12, maxZoom: 1 })}><Scan size={17} /></button>
  </div>;
}

export function AiNetwork({ visible }: { visible: boolean }) {
  const [active, setActive] = useState<Entry["id"]>("google");
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState("");
  const [company, setCompany] = useState("");
  const [tech, setTech] = useState("");
  const [compact, setCompact] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const media = matchMedia("(max-width: 780px)");
    function sync() { setCompact(media.matches); }
    sync();
    media.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (!visible) {
      clearTimeout(timer.current);
      setPlaying(false);
    }
  }, [visible]);

  const simplify = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const matches = entries.filter((item) => (!layer || Number(layer) === item.layer) && (!company || company === item.id)
    && (!tech || tech === item.tech) && simplify(`${item.company} ${item.tech} ${layers[item.layer]}`).includes(simplify(query.trim())));
  const selected = matches.find(({ id }) => id === active) ?? matches[0];
  const sources = selected ? connections.filter(({ from, to }) => from === selected.id || to === selected.id) : [];
  const related = new Set<string>(sources.flatMap(({ from, to }) => [from, to]));
  const filtered = new Set(matches.map(({ id }) => id));
  const nodes: InfrastructureNode[] = entries.map((entry) => {
    const secondCloud = entry.id === "google";
    const cloudLane = entry.layer === 1 && !secondCloud;
    const position = compact
      ? { x: cloudLane ? 0 : 167, y: entry.layer * 127 }
      : { x: entry.layer * 195, y: cloudLane ? 5 : 148 };
    return { id: entry.id, type: "infrastructure", position, hidden: !filtered.has(entry.id), data: {
      entry, active: entry.id === selected?.id, muted: Boolean(selected && entry.id !== selected.id && !related.has(entry.id)), compact, onInspect: inspect,
    } };
  });
  const edges: Edge[] = connections.filter(({ from, to }) => filtered.has(from) && filtered.has(to)).map(({ from, to, solid }) => {
    const highlighted = selected?.id === from || selected?.id === to;
    return { id: `${from}-${to}`, source: from, target: to, type: "smoothstep", focusable: false,
      className: `nx-edge ${solid ? "nx-edge-solid" : "nx-edge-technical"} ${highlighted ? "nx-edge-active" : ""}`,
      markerEnd: { type: MarkerType.ArrowClosed, color: highlighted ? "#9a6326" : "#657588", width: 15, height: 15 },
    };
  });
  function stop() { clearTimeout(timer.current); setPlaying(false); }
  function inspect(id: Entry["id"]) { stop(); setActive(id); }
  function narrate() {
    stop(); setLayer(""); setCompany(""); setTech(""); setQuery(""); setActive("google");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive("api"); return; }
    setPlaying(true);
    timer.current = setTimeout(() => {
      setActive("vllm");
      timer.current = setTimeout(() => { setActive("api"); setPlaying(false); }, 1350);
    }, 1350);
  }

  return <div className="nx-network">
    <div className="nx-network-toolbar">
      <label className="nx-network-search"><span>Buscar</span><span><Search size={17} /><input value={query} onChange={(event) => { stop(); setQuery(event.target.value); }} placeholder="Buscar en la red" /></span></label>
      <label>Capa<select value={layer} onChange={(event) => { stop(); setLayer(event.target.value); }}><option value="">Todas</option>{layers.map((item, index) => <option key={item} value={index}>{item}</option>)}</select></label>
      <label>Empresa o proyecto<select value={company} onChange={(event) => { stop(); setCompany(event.target.value); }}><option value="">Todos</option>{entries.map(({ id, company: name }) => <option key={id} value={id}>{name}</option>)}</select></label>
      <label>Tecnología<select value={tech} onChange={(event) => { stop(); setTech(event.target.value); }}><option value="">Todas</option>{entries.map(({ tech: name }) => <option key={name}>{name}</option>)}</select></label>
    </div>
    <div className="nx-network-layout">
      <div className="nx-network-board" data-playing={playing}>
        {visible && matches.length > 0 && <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} nodesConnectable={false} nodesDraggable={false} nodesFocusable={false} edgesFocusable={false} zoomOnScroll={false} zoomOnPinch preventScrolling={false} panOnDrag minZoom={.25} maxZoom={2.5} fitView fitViewOptions={{ padding: .12, maxZoom: 1 }} proOptions={{ hideAttribution: true }} aria-label="Red de infraestructura IA">
          <Background gap={18} size={1.1} color="#c5cbc9" />
          <MapControls signal={`${compact}:${matches.map(({ id }) => id).join(",")}`} />
        </ReactFlow>}
        {matches.length === 0 && <p className="nx-network-empty" role="status">No hay coincidencias con estos filtros.</p>}
        <div className="nx-network-key"><span>Oferta documentada</span><span>Vínculo técnico documentado</span></div>
      </div>
      <aside className="nx-network-detail" aria-label="Relaciones de la selección">
        {selected && <><div className="nx-network-selected" aria-live="polite">
          <p className="nx-kicker">{layers[selected.layer]}</p><h4>{selected.company}</h4><p>{selected.note}</p>
        </div><ul>{sources.map(({ source, kind }) => <li key={source.url}><small>{kind}</small><strong>{source.label}</strong><p>{source.explanation}</p><a href={source.url}>{source.source} <ArrowUpRight size={14} /></a><time dateTime={checked}>Referencia registrada · 23 nov 2026</time></li>)}</ul></>}
        <button type="button" className="nx-network-play" onClick={narrate}><Route size={17} />{playing ? "Reiniciar recorrido" : "Seguir una solicitud de IA"}</button>
        <p className="nx-network-note">El recorrido sigue Google Cloud → vLLM → cliente API. La relación NVIDIA → AWS es un ejemplo independiente.</p>
      </aside>
    </div>
  </div>;
}
