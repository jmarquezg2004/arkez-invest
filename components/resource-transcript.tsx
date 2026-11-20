import editions from "@/resources/editorial.json";

import type { EditionSlug } from "@/lib/library";

export function ResourceTranscript({ slug }: { slug: EditionSlug }) {
  const edition = editions.documents.find((document) => document.slug === slug);
  if (!edition) return null;

  return (
    <details className="resource-transcript">
      <summary>Leer la edición completa en formato HTML</summary>
      <p>{edition.title} · {edition.subtitle}</p>
      {edition.chapters.map(({ title, lead, figure, table, exercise, answer }) => (
        <section key={title}>
          <h3>{title}</h3>
          <p>{lead}</p>
          {figure.values
            ? <p>{figure.unit}: {figure.labels.map((label, index) => `${label} ${figure.values?.[index]}`).join(" · ")}</p>
            : <p>Secuencia: {figure.labels.join(" → ")}</p>}
          <div className="resource-table-scroll" tabIndex={0} role="region" aria-label={`Tabla de datos: ${title}`}>
            <table>
              <thead><tr>{table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
              <tbody>{table.rows.map((row) => (
                <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, index) => <td key={index}>{cell}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
          <p><strong>Ejercicio.</strong> {exercise}</p>
          <p><strong>Solución.</strong> {answer}</p>
        </section>
      ))}
      <h3>Conclusiones y fuentes</h3>
      <ul className="resource-conclusions">{edition.conclusions.map((conclusion) => <li key={conclusion}>{conclusion}</li>)}</ul>
      <ul className="reading-links" role="list">{edition.sources.map((key) => {
        const source = editions.sources[key as keyof typeof editions.sources];
        return <li key={key}><a href={source.url}>{source.name}</a></li>;
      })}</ul>
    </details>
  );
}
