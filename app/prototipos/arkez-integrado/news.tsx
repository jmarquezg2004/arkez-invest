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
const regionalSources = [
  ["Estados Unidos", "Federal Reserve", "https://www.federalreserve.gov/newsevents.htm"],
  ["Europa", "Banco Central Europeo", "https://www.ecb.europa.eu/press/html/index.en.html"],
  ["Asia", "Banco de Japón", "https://www.boj.or.jp/en/whatsnew/index.htm"],
  ["América Latina", "Latam Fintech Hub", "https://www.latamfintech.co/articles"],
] as const;
const regionalReading = {
  title: "Fintoc presenta pagos empresariales internacionales desde México",
  href: "https://www.latamfintech.co/articles/fintoc-lanza-cross-border-payments-para-habilitar-pagos-internacionales-a-empresas-desde-mexico",
  date: "2026-11-19",
  source: "Latam Fintech Hub",
};
const socialSources = [
  ["Reserva Federal", "https://x.com/federalreserve"],
  ["Bank of America", "https://x.com/BankofAmerica"],
  ["The Wall Street Journal", "https://x.com/WSJ"],
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

  const [batch, setBatch] = useState(0);
  const [rotating, setRotating] = useState(false);

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
    const refresh = () => { void loadStories().then((stories) => {
      if (!controller.signal.aborted) setLive((previous) => stories.length ? stories : previous ?? []);
    }); };
    refresh();
    const timer = window.setInterval(refresh, 120_000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotating(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const stories = live?.length ? live : fallback;
  const pages = Math.max(1, Math.ceil(stories.length / 2));
  useEffect(() => {
    if (!rotating || directoryPage || pages < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setBatch((current) => (current + 1) % pages);
    }, 120_000);
    return () => window.clearInterval(timer);
  }, [rotating, directoryPage, pages]);
  const offset = (batch % pages) * 2;

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
        {(directoryPage ? stories : stories.slice(offset, offset + 2)).map((story) => { const { title, href, date } = story; return <li key={href}>
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
      {!directoryPage && pages > 1 && <div className="ai-news-sources">
        <button type="button" onClick={() => setBatch((current) => (current + 1) % pages)}>Ver otros titulares</button>
        <button type="button" aria-pressed={rotating} onClick={() => setRotating(!rotating)}>Rotación automática</button>
      </div>}
      <div className="ai-news-sources">
        <span>Consultar directamente</span>
        {publishers.map(([name, href]) => <a key={name} href={href}>{name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div>
      {directoryPage && <><div className="ai-news-sources">
        <span>Lectura de América Latina</span>
        <a href={regionalReading.href}>{regionalReading.title} · {regionalReading.source} · <time dateTime={regionalReading.date}>{dateFormat.format(new Date(regionalReading.date))}</time></a>
      </div><div className="ai-news-sources"><span>Fuentes por región</span>
        {regionalSources.map(([region, name, href]) => <a key={href} href={href}>{region} · {name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div><div className="ai-news-sources"><span>Cuentas en X</span>
        {socialSources.map(([name, href]) => <a key={href} href={href}>{name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div></>}
    </div>
  </section>;
}
