"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { createPreviewNews } from "@/scripts/preview-news.mjs";
import { archivedHeadlines, directoryArchive } from "@/scripts/news-archive.mjs";
import { useLanguage } from "./language";
import { directoryBatch, directoryGroups, directorySources } from "./news-mix";

type Story = { title: string; href: string; date: string; source: string; image?: string; archived?: boolean };

const readBrowserFeeds = createPreviewNews();
const rotationMs = 5 * 60_000;
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
const dateFormat = {
  es: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  en: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
};

function StoryCover({ story, onUnavailable }: { story: Story; onUnavailable(): void }) {
  const [attempt, setAttempt] = useState(0);
  const src = story.image && attempt < 2
    ? attempt === 0 ? story.image : `/api/noticias/imagen?url=${encodeURIComponent(story.image)}`
    : undefined;
  return <div className="ai-news-cover" data-original={src ? undefined : "unavailable"}>
    {src ? <img key={src} src={src} alt="" width="960" height="540" loading="lazy" decoding="async" onError={() => {
      setAttempt(attempt + 1);
      if (attempt === 1) onUnavailable();
    }} />
      : <small>Foto original no disponible</small>}
    <span>{story.source}</span>
  </div>;
}

export function PreviewNews({ directory, directoryPage = false }: { directory: string; directoryPage?: boolean }) {
  const { locale } = useLanguage();
  const articleList = useRef<HTMLUListElement>(null);
  const [live, setLive] = useState<Story[] | null>(null);
  const [unavailable, setUnavailable] = useState<ReadonlySet<string>>(new Set());

  const [batch, setBatch] = useState(0);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadStories() {
      try {
        const response = await fetch("/api/noticias/preview", { signal: controller.signal });
        const stories: unknown = response.ok ? await response.json() : null;
        if (Array.isArray(stories) && stories.length && (directoryPage || stories.some((story) => story?.image))) return stories as Story[];
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
    const timer = window.setInterval(refresh, rotationMs);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [directoryPage]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotating(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const count = 2;
  const archive = archivedHeadlines.filter(({ href }) => !live?.some((story) => story.href === href));
  const photoAvailable = ({ image }: Story) => Boolean(image && !unavailable.has(image));
  const published = live ?? [];
  const withPhoto = published.filter(photoAvailable);
  const backupPhotos = archive.filter(photoAvailable);
  const stories = [...withPhoto, ...backupPhotos, ...published.filter((story) => !photoAvailable(story)), ...archive.filter((story) => !photoAvailable(story))];
  const pool = withPhoto.length + backupPhotos.length >= count ? [...withPhoto, ...backupPhotos] : stories;
  const groups = directoryGroups(published, [...directoryArchive, ...archive]);
  const canRotate = directoryPage ? groups.some(({ stories, slots }) => stories.length > slots) : pool.length > count;

  useEffect(() => {
    if (!rotating || !canRotate) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !articleList.current?.contains(document.activeElement)) setBatch((current) => current + 1);
    }, rotationMs);
    return () => window.clearInterval(timer);
  }, [rotating, canRotate]);
  const shown = directoryPage ? directoryBatch(groups, batch)
    : pool.length <= count ? pool : Array.from({ length: count }, (_, i) => pool[(batch * count + i) % pool.length]);
  const sourceLinks = directoryPage ? directorySources.map(({ source, href }) => [source, href] as const) : publishers;

  return <section className="ai-news" id="noticias" aria-labelledby="preview-news-heading">
    <div className="container-shell">
      <header className="ai-news-heading">
        <div><p className="eyebrow"><Newspaper size={17} aria-hidden="true" /> Lecturas externas</p>
          <h2 id="preview-news-heading">Noticias y actualidad</h2></div>
        {!directoryPage && <a href={directory}>Ver toda la actualidad <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </header>
      <p className="ai-news-status" role="status">{live === null ? "Buscando titulares recientes."
        : live.length ? "Titulares de las fuentes disponibles." : "Selección de archivo mientras se restablecen los titulares."}</p>
      <ul className="ai-news-stories" data-directory={directoryPage || undefined} role="list" ref={articleList}>
        {shown.map((story) => { const { title, href, date, image } = story; return <li key={href}>
          <article>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <StoryCover key={image} story={unavailable.has(image ?? "") ? { ...story, image: undefined } : story}
                onUnavailable={() => { if (image) setUnavailable((current) => new Set([...current, image])); }} />
              <div className="ai-news-copy">
                <p><time dateTime={date} data-arkez-localized>{dateFormat[locale].format(new Date(date))}</time>{story.archived && <span> · Archivo</span>}</p>
                <h3 translate="no" lang={story.source === "Reserva Federal" || story.source === "The Wall Street Journal"
                  || /https:\/\/(finance\.yahoo\.com|cointelegraph\.com)\//.test(href) ? "en" : "es"}>{title}</h3>
                <ArrowUpRight size={21} aria-hidden="true" />
              </div>
            </a>
          </article>
        </li>; })}
      </ul>
      {canRotate && <div className="ai-news-sources">
        <button type="button" onClick={() => setBatch((current) => current + 1)}>Ver otros titulares</button>
        <button type="button" aria-pressed={rotating} onClick={() => setRotating(!rotating)}>Rotación cada 5 minutos</button>
      </div>}
      <div className="ai-news-sources">
        <span>Consultar directamente</span>
        {sourceLinks.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer">{name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div>
      {directoryPage && <><div className="ai-news-sources">
        <span>Lectura de América Latina</span>
        <a href={regionalReading.href} target="_blank" rel="noopener noreferrer">{regionalReading.title} · {regionalReading.source} · <time dateTime={regionalReading.date} data-arkez-localized>{dateFormat[locale].format(new Date(regionalReading.date))}</time></a>
      </div><div className="ai-news-sources"><span>Fuentes por región</span>
        {regionalSources.map(([region, name, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer">{region} · {name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div><div className="ai-news-sources"><span>Cuentas en X</span>
        {socialSources.map(([name, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer">{name} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
      </div></>}
    </div>
  </section>;
}
