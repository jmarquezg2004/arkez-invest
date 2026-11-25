"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Compass, Search, X } from "lucide-react";
import { catalog, categories, type CatalogItem } from "../catalog";
import { ArtImage } from "./art";
import { base } from "./shell";

const storageKey = "arkez-explore-saved";
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function Shelf({ title, items, saved, onSave, onPreview }: {
  title: string; items: CatalogItem[]; saved: string[]; onSave: (id: string) => void; onPreview: (item: CatalogItem) => void;
}) {
  const track = useRef<HTMLUListElement>(null);
  function page(direction: number) {
    const element = track.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * element.clientWidth * .84, behavior: reduced ? "instant" : "smooth" });
  }

  return <section className="ve-shelf">
    <header><h2>{title}</h2>{items.length > 1 && <div className="ve-carousel-controls">
      <button type="button" onClick={() => page(-1)} aria-label={`Retroceder en ${title}`}><ArrowLeft size={18} /></button>
      <button type="button" onClick={() => page(1)} aria-label={`Avanzar en ${title}`}><ArrowRight size={18} /></button>
    </div>}</header>
    <ul ref={track} className="ve-track" role="list">{items.map((item) => <li key={item.id} className="ve-cover" data-palette={item.palette}>
      <ArtImage art={item.art} />
      <button type="button" className="ve-cover-open" onClick={() => onPreview(item)} aria-haspopup="dialog">
        <span>{item.ticker ?? "Guía"}</span><strong>{item.name}</strong><small>{item.topic}</small><ArrowUpRight size={20} aria-hidden="true" />
      </button>
      <button type="button" className="ve-save" onClick={() => onSave(item.id)} aria-pressed={saved.includes(item.id)} aria-label={`Guardar ${item.name}`}><Bookmark size={19} /></button>
    </li>)}</ul>
  </section>;
}

export function Explore({ market, onMarketPath }: { market?: React.ReactNode; onMarketPath?: string } = {}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((id) => catalog.some((item) => item.id === id)));
    } catch { /* The catalog remains available when storage is blocked. */ }
  }, []);

  function save(id: string) {
    const next = saved.includes(id) ? saved.filter((value) => value !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Keep the in-memory selection. */ }
  }

  function filter(id: string) { setCategory(id); setOnlySaved(false); }
  const results = catalog.filter((item) => {
    const label = categories.find(([id]) => id === item.category)?.[1];
    return (!category || item.category === category) && (!onlySaved || saved.includes(item.id))
      && normalize(`${item.name} ${item.ticker ?? ""} ${item.topic} ${label}`).includes(normalize(query.trim()));
  });

  return <div className="ve-discovery">
    <aside className="ve-side" aria-label="Explorar por categoría">
      <div><Compass size={19} /> Biblioteca</div>
      <button type="button" aria-pressed={!category && !onlySaved} onClick={() => filter("")}>Todas las categorías</button>
      {categories.map(([id, label]) => <button type="button" key={id} aria-pressed={category === id && !onlySaved} onClick={() => filter(id)}>{label}</button>)}
      <button className="ve-side-saved" type="button" aria-pressed={onlySaved} onClick={() => { setCategory(""); setOnlySaved(!onlySaved); }}><Bookmark size={17} /> Mis guardados <b>{saved.length}</b></button>
    </aside>
    <div className="ve-discovery-main">
      <section className="ve-explore-hero">
        <ArtImage art="chain" eager />
        <div><p className="ve-kicker">Arkez Explore</p><h1>Descubre,<br />analiza y aprende.</h1><p>Explora empresas, sectores y cadenas de valor a través de casos de estudio.</p>
          <a className="ve-cta" href={base + "nubank/"}>Abrir el caso Nubank <ArrowUpRight size={18} /></a></div>
      </section>
      {market}
      <div className="ve-filters">
        <label className="ve-search"><Search size={20} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar en el catálogo por empresa, ticker, sector o tema" placeholder="Buscar empresa, ticker o tema…" /></label>
        <select aria-label="Categoría" value={category} onChange={(event) => filter(event.target.value)}><option value="">Todas las categorías</option>{categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
        <button type="button" aria-pressed={onlySaved} onClick={() => { setCategory(""); setOnlySaved(!onlySaved); }}><Bookmark size={17} /> Guardados ({saved.length})</button>
      </div>
      <p className="ve-results" aria-live="polite">{results.length} {results.length === 1 ? "resultado" : "resultados"}</p>
      {results.length === 0 && <p className="ve-empty">{onlySaved ? "No hay estudios guardados con esta búsqueda." : "No encontramos resultados para estos filtros."} <button type="button" onClick={() => { setQuery(""); filter(""); }}>Restablecer filtros</button></p>}
      {categories.map(([id, label]) => {
        const items = results.filter((item) => item.category === id);
        return items.length ? <Shelf key={id} title={label} items={items} saved={saved} onSave={save} onPreview={(item) => { setSelected(item); dialog.current?.showModal(); }} /> : null;
      })}
    </div>
    <dialog ref={dialog} className="ve-dialog" aria-labelledby="ve-preview-title">
      <form method="dialog"><button type="submit" aria-label="Cerrar vista previa"><X size={22} /></button></form>
      {selected && <>
        <div className="ve-dialog-art"><ArtImage art={selected.art} /></div>
        <div className="ve-dialog-copy"><p className="ve-kicker">{selected.ticker ?? "Guía educativa"}</p><h2 id="ve-preview-title">{selected.name}</h2><p>{selected.summary}</p>
          {selected.ticker && onMarketPath && <a className="ve-cta" href={onMarketPath + "?ticker=" + encodeURIComponent(selected.ticker) + "#consultar-ticker"}>Consultar {selected.ticker} <ArrowUpRight size={17} /></a>}
          {selected.href && <a className="ve-cta" href={base + selected.href}>Abrir recurso <ArrowUpRight size={17} /></a>}</div>
      </>}
    </dialog>
  </div>;
}
