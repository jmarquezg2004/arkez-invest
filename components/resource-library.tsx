"use client";

import { useEffect, useState } from "react";
import { resourceCategories, resources } from "@/lib/library";

function normalized(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es").trim();
}

const searchIndex = resources.map((resource) => ({
  resource,
  text: normalized([resource.title, resource.description, ...resource.terms].join(" ")),
}));

export function ResourceLibrary() {
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => setReady(true), []);

  const words = normalized(query).split(/\s+/).filter(Boolean);
  const results = searchIndex
    .filter(({ resource, text }) => (!category || resource.category === category) && words.every((word) => text.includes(word)))
    .map(({ resource }) => resource);

  function clear() {
    setQuery("");
    setCategory("");
  }

  return (
    <section className="resource-library" aria-labelledby="library-title">
      <h2 className="section-title" id="library-title">Biblioteca de recursos</h2>
      <div className="library-filters" role="search" aria-label="Buscar en la biblioteca">
        <div>
          <label htmlFor="resource-query">Buscar recursos</label>
          <input id="resource-query" type="search" value={query} disabled={!ready} maxLength={120}
            placeholder="Ejemplo: riesgo o flujo de caja" onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div>
          <label htmlFor="resource-category">Categoría</label>
          <select id="resource-category" value={category} disabled={!ready} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Todas las categorías</option>
            {resourceCategories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
        <button className="button button-outline" type="button" onClick={clear} disabled={!ready || (!query && !category)}>Limpiar filtros</button>
      </div>
      <noscript><p>Puedes abrir todos los recursos de la lista. Activa JavaScript para buscar y filtrar.</p></noscript>
      <p className="library-result" role="status">
        {results.length === 1 ? "1 recurso" : `${results.length} recursos`}
        {!results.length && ". Prueba con otro término o limpia los filtros."}
      </p>
      <ul className="library-grid" role="list">
        {results.map(({ id, title, description, category: kind, read, file }) => (
          <li key={id}>
            <article className="library-card">
              <p className="eyebrow">{resourceCategories.find(({ id: key }) => key === kind)?.label}</p>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="library-actions">
                <a href={read} aria-label={`Leer: ${title}`}>Leer</a>
                {file?.format === "PDF" && <a href={file.href} aria-label={`Ver PDF: ${title}`}>Ver PDF</a>}
                {file && <a href={file.href} download aria-label={`Descargar ${file.format}: ${title}`}>Descargar {file.format}</a>}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
