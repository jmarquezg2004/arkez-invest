"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { createPreviewNews } from "@/scripts/preview-news.mjs";
import { editorialNews } from "@/lib/external-directory";

type Story = { title: string; href: string; date: string; source: string; image?: string };

const readBrowserFeeds = createPreviewNews();
const fallback: Story[] = Object.values(editorialNews);
const publishers = [
  ["Investing España", "https://es.investing.com/news/"],
  ["Cointelegraph", "https://es.cointelegraph.com/"],
  ["Yahoo Finanzas", "https://es.finance.yahoo.com/"],
] as const;
const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function StoryCover({ story }: { story: Story }) {
  const [attempt, setAttempt] = useState(0);
  const src = story.image && attempt < 2
    ? attempt === 0 ? story.image : `/api/noticias/imagen?url=${encodeURIComponent(story.image)}`
    : undefined;
  return <div className="ai-news-cover" data-original={src ? undefined : "unavailable"}>
    {src ? <img key={src} src={src} alt="" width="960" height="540" loading="lazy" decoding="async" onError={() => setAttempt((value) => value + 1)} />
      : <small>Foto original no disponible</small>}
    <span>{story.source}</span>
  </div>;
}

export function PreviewNews({ directory, directoryPage = false }: { directory: string; directoryPage?: boolean }) {
  const [live, setLive] = useState<Story[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadStories() {
      try {
        const response = await fetch("/api/noticias/preview", { signal: controller.signal });
        const stories: unknown = response.ok ? await response.json() : null;
        if (Array.isArray(stories) && stories.length && stories.some((story) => story?.image)) return stories as Story[];
        const direct = await readBrowserFeeds();
        return direct.length ? direct : Array.isArray(stories) ? stories as Story[] : [];
      } catch {
        return controller.signal.aborted ? [] : readBrowserFeeds();
      }
    }
    void loadStories().then((stories) => { if (!controller.signal.aborted) setLive(stories); });
    return () => controller.abort();
  }, []);

  return <section className="ai-news" id="noticias" aria-labelledby="preview-news-heading">
    <div className="container-shell">
      <header className="ai-news-heading">
        <div><p className="eyebrow"><Newspaper size={17} aria-hidden="true" /> Lecturas externas</p>
          <h2 id="preview-news-heading">Noticias y actualidad</h2></div>
        {!directoryPage && <a href={directory}>Ver toda la actualidad <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </header>
      <p className="ai-news-status" role="status">{live === null ? "Buscando titulares recientes. Puedes consultar la selección editorial mientras tanto."
        : live.length ? "Titulares recientes de las fuentes disponibles." : "Los titulares automáticos no están disponibles. Consulta la selección editorial."}</p>
      <ul className="ai-news-stories" role="list">
        {(live?.length ? live : fallback).map((story) => { const { title, href, date } = story; return <li key={href}>
          <article>
            <a href={href}>
              <StoryCover key={story.image} story={story} />
              <div className="ai-news-copy">
                <p><time dateTime={date}>{dateFormat.format(new Date(date))}</time></p>
                <h3>{title}</h3>
                <ArrowUpRight size={21} aria-hidden="true" />
              </div>
            </a>
          </article>
        </li>; })}
      </ul>
      <div className="ai-news-sources">
        <span>Consultar directamente</span>
        {publishers.map(([name, href]) => <a key={name} href={href}>{name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div>
    </div>
  </section>;
}
