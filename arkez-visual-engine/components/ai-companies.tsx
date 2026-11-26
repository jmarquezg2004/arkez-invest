"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Network, Search } from "lucide-react";
import directory from "../ai-attachment-directory.json";

type Company = [string, string, number | "T", boolean];
const companies = directory as Company[];
const groups = ["Energía y red", "Equipos y EDA", "Diseño de chips", "Fabricación y memoria", "Servidores y redes", "Centros de datos y nube", "Modelos y aplicaciones"];
const documented = [
  { from: "AMZN", to: "Anthropic", title: "Capacidad de entrenamiento", detail: "Amazon documentó que Anthropic usaría chips AWS Trainium para entrenar y desplegar modelos.", href: "https://www.aboutamazon.com/news/aws/amazon-invests-additional-4-billion-anthropic-ai" },
  { from: "GOOGL", to: "Anthropic", title: "Aceleradores TPU", detail: "Anthropic anunció una ampliación de su uso de aceleradores TPU de Google Cloud.", href: "https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services" },
  { from: "ORCL", to: "OpenAI", title: "Infraestructura de centros de datos", detail: "Oracle y OpenAI anunciaron un acuerdo para desarrollar capacidad adicional para Stargate en Estados Unidos.", href: "https://openai.com/index/stargate-advances-with-partnership-with-oracle/" },
  { from: "CEG", to: "MSFT", title: "Acuerdo de compra de energía", detail: "Constellation anunció un acuerdo de suministro eléctrico de 20 años con Microsoft asociado al proyecto Crane.", href: "https://investors.constellationenergy.com/news-releases/news-release-details/constellation-wins-platts-global-energy-award-crane-clean-energy" },
  { from: "NVDA", to: "AMZN", title: "Aceleradores en la nube", detail: "AWS documenta el uso de GPU NVIDIA H100 en instancias EC2 P5.", href: "https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html" },
];
const format = (name: string) => name.split(" · ")[0];

export function AiCompanies() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [chosen, setChosen] = useState("NVDA");
  const matches = companies.filter(([id, name, group]) => (!stage || String(group) === stage)
    && (id + " " + name).toLowerCase().includes(query.trim().toLowerCase()));
  const selection = matches.some(([id]) => id === chosen) ? chosen : matches[0]?.[0];
  const company = matches.find(([id]) => id === selection);
  const relations = documented.filter(({ from, to }) => from === selection || to === selection);
  const label = (ticker: string) => format(companies.find(([id]) => id === ticker)?.[1] ?? ticker);
  return <section id="empresas-cadena-ia" className="ve-ai-companies" aria-labelledby="empresas-ia-titulo">
    <h2 id="empresas-ia-titulo"><Network aria-hidden="true" /> Mapa de relaciones de IA</h2>
    <p>Directorio del mapa aportado por Arkez. Los enlaces entre empresas se muestran cuando tienen fuente primaria.</p>
    <ul className="ve-ai-network" aria-label="Relaciones documentadas">{documented.map(({ from, to, title, href }) => <li key={href}>
      <button type="button" aria-pressed={selection === from} onClick={() => { setQuery(""); setStage(""); setChosen(from); }}>{label(from)}</button>
      <span><ArrowRight size={16} aria-hidden="true" /> {title}</span>
      <button type="button" aria-pressed={selection === to} onClick={() => { setQuery(""); setStage(""); setChosen(to); }}>{label(to)}</button>
    </li>)}</ul>
    <div className="ve-ai-search">
      <label>Buscar empresa o ticker<span><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej. NVIDIA" /></span></label>
      <label>Etapa<select value={stage} onChange={(e) => setStage(e.target.value)}><option value="">Todas las etapas</option>{groups.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}<option value="T">Capas transversales</option></select></label>
    </div>
    <p role="status">{matches.length} {matches.length === 1 ? "empresa" : "empresas"}</p>
    <div className="ve-ai-directory">
      <ul role="list">{matches.map(([id, name]) => <li key={id}><button type="button" aria-pressed={id === selection} onClick={() => setChosen(id)}>{format(name)}</button></li>)}</ul>
      {company && <section className="ve-ai-company" aria-live="polite"><p>{company[2] === "T" ? "Capas transversales" : groups[Number(company[2]) - 1]}{company[3] ? " · " + company[0] : ""}</p><h3>{format(company[1])}</h3>
        {relations.length ? relations.map(({ from, to, title, detail, href }) => <div className="ve-ai-relation" key={href}>
          <p><strong>{label(from)}</strong> <ArrowRight size={16} aria-label="hacia" /> <strong>{label(to)}</strong></p>
          <h4>{title}</h4><p>{detail}</p><a href={href}>Ver documento original <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>) : <p>Ficha de la cadena. Las relaciones de esta empresa están pendientes de verificación.</p>}
      </section>}
    </div>
  </section>;
}
