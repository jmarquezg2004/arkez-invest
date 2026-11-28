"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ChartCandlestick, Search } from "lucide-react";

import { catalog } from "@/arkez-visual-engine/catalog";
import { base, oddityStoryPath, visualStoriesPath } from "./routes";

import { useLanguage } from "./language";
import { TickerStory } from "./visual-stories/ticker-story";
import { CompanyStory, type GeneratedCompanyStory } from "./visual-stories/company-story";
import { companyStoryFor } from "./visual-stories/company-stories";

const freeConsultationKey = "arkez-research-demo-free-ticker-v1";
const cleanTicker = (symbol: string) => symbol.split(":").at(-1)?.replaceAll(".", "-") ?? "";
const normalizeName = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const profileFor = (symbol: string) => catalog.find(({ ticker }) => ticker === cleanTicker(symbol));

type Issuer = {
  name: string; exchange?: string; sector?: string;
  edgar?: string; fromBackup?: boolean; filingsUnavailable?: boolean;
  filings: { form: string; date: string; href: string }[];
};

const samples = ["NASDAQ:SPCX", "NYSE:TGLS", "NYSE:KSS", "NASDAQ:ODD", "NYSE:NU", "NASDAQ:TTD", "NASDAQ:AAPL", "AMEX:SPY"];
const kss = { name: "Kohl’s Corporation", exchange: "NYSE", filings: [{ form: "10-K", date: "2026-03-19", href: "https://www.sec.gov/Archives/edgar/data/885639/000119312526115982/kss-20260131.htm" }] };
const tgls: Issuer = {
  name: "Tecnoglass Holdings Inc.", exchange: "NYSE",
  edgar: "https://www.sec.gov/edgar/browse/?CIK=1534675&owner=exclude",
  filings: [{ form: "10-Q", date: "2026-11-09", href: "https://www.sec.gov/Archives/edgar/data/1534675/000149315226050739/form10-q.htm" }],
};
const verifiedIssuers: Record<string, Issuer> = { KSS: kss, TGLS: tgls };
const companyExchanges: Record<string, string> = { BB: "NYSE", SPCX: "NASDAQ", TGLS: "NYSE", KSS: "NYSE", AAPL: "NASDAQ", TTD: "NASDAQ", NU: "NYSE", JPM: "NYSE", XOM: "NYSE", WMT: "NASDAQ", LLY: "NYSE", SPY: "NYSEARCA" };

function IssuerDetails({ issuer }: { issuer: Issuer }) {
  return <div className="ai-market-issuer">
    <h3>{issuer.name}</h3>
    <p>{[issuer.exchange, issuer.sector].filter(Boolean).join(" · ")}</p>
    {issuer.filings.length > 0 && <ul role="list">{issuer.filings.map(({ form, date, href }) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{form} · <time dateTime={date}>{date}</time> <ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul>}
    {issuer.fromBackup && <p>Identificación basada en una copia del directorio de la SEC.</p>}
    {issuer.filingsUnavailable && <p>Consulta las publicaciones recientes directamente en EDGAR.</p>}
    {issuer.edgar && <a href={issuer.edgar} target="_blank" rel="noopener noreferrer">Ver expediente en EDGAR <ArrowUpRight size={15} aria-hidden="true" /></a>}
  </div>;
}

const validSymbol = /^(?:[A-Z0-9_-]{1,20}:)?[A-Z0-9][A-Z0-9._!^=-]{0,22}$/;
function chartUrl(symbol: string, locale: string) {
  const url = new URL("https://s.tradingview.com/widgetembed/");
  url.search = new URLSearchParams({
    symbol, interval: "D", theme: "dark", style: "1", locale,
    timezone: "Etc/UTC", symboledit: "1", saveimage: "0", hideideas: "1", withdateranges: "1",
  }).toString();
  return url.href;
}

export function MarketLookup() {
  const { locale } = useLanguage();
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState("");
  const [message, setMessage] = useState("");
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [filingStatus, setFilingStatus] = useState("");
  const [generated, setGenerated] = useState<GeneratedCompanyStory | null>(null);
  const [storyUnavailable, setStoryUnavailable] = useState(false);
  const [storyAttempt, setStoryAttempt] = useState(0);

  const [blocked, setBlocked] = useState(false);
  const usedTicker = useRef("");
  const result = useRef<HTMLDivElement>(null);

  function savedTicker() {
    try { return localStorage.getItem(freeConsultationKey) || usedTicker.current; }
    catch { return usedTicker.current; }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    select(input);
  }

  function select(input: string) {
    const requested = input.trim().replace(/^kohl[’']?s(?: corporation)?$/i, "NYSE:KSS")
      .replace(/^blackberry(?: (?:ltd|limited)\.?)?$/i, "NYSE:BB")
      .replace(/^space\s?x$/i, "NASDAQ:SPCX")
      .replace(/^tecnoglass(?: holdings)?(?: inc\.?)?$/i, "NYSE:TGLS");
    const knownCompany = catalog.find(({ name, ticker }) => ticker && normalizeName(name) === normalizeName(requested));
    const next = knownCompany?.ticker ?? (/^oddity(?: tech)?$/i.test(requested) ? "NASDAQ:ODD" : requested.toUpperCase());
    if (!validSymbol.test(next)) {
      setMessage("Escribe el ticker o el nombre exacto de una empresa del catálogo.");
      return;
    }
    setMessage("");
    setInput(next);
    if (next !== symbol) {
      setIssuer(null);
      setGenerated(null);
      setStoryUnavailable(false);
      setFilingStatus("");
      const saved = savedTicker();
      setBlocked(Boolean(saved && saved !== cleanTicker(next)));
      setSymbol(next);
    } else {
      if (storyUnavailable) {
        setStoryUnavailable(false);
        setStoryAttempt((count) => count + 1);
      }
      result.current?.focus();
    }
  }

  useEffect(() => {
    const ticker = new URLSearchParams(window.location.search).get("ticker")?.toUpperCase() ?? "";
    if (validSymbol.test(ticker)) {
      const saved = savedTicker();
      setBlocked(Boolean(saved && saved !== cleanTicker(ticker)));
      setInput(ticker);
      setSymbol(ticker);
    }
  }, []);

  const ticker = cleanTicker(symbol);
  const matchingExchange = !symbol.includes(":") || /^(NASDAQ|NYSE|AMEX|NYSEARCA|OTC|CBOE|BATS):/.test(symbol);
  const requestedExchange = symbol.includes(":") ? symbol.split(":")[0] : "";
  const profileMatch = profileFor(symbol);
  const knownExchange = companyExchanges[ticker] ?? (profileMatch ? "NASDAQ" : "");
  const profile = !requestedExchange || requestedExchange === knownExchange ? profileMatch : undefined;
  const publicIssuer = !requestedExchange || requestedExchange === "NYSE"
    ? verifiedIssuers[ticker] ?? null : null;
  const chartSymbol = requestedExchange || !knownExchange ? symbol : knownExchange + ":" + ticker;
  const odditySelected = /^(?:NASDAQ:)?ODD$/.test(symbol);
  const fundSelected = /^(?:(?:AMEX|NYSEARCA):)?SPY$/.test(symbol);
  const storySymbol = odditySelected ? "NASDAQ:ODD" : fundSelected ? "AMEX:SPY" : chartSymbol;
  const illustrated = Boolean(companyStoryFor(storySymbol));

  useEffect(() => {
    if (!symbol) return;
    const previous = savedTicker();
    const limited = Boolean(previous && previous !== ticker);
    setBlocked(limited);
    const reserve = () => {
      usedTicker.current = ticker;
      try { localStorage.setItem(freeConsultationKey, ticker); } catch {}
    };
    if (!limited && (profile || publicIssuer || odditySelected || fundSelected)) reserve();
    if (!matchingExchange || !/^[A-Z][A-Z0-9-]{0,11}$/.test(ticker)) {
      setFilingStatus("No hay una ficha verificada disponible para ese mercado.");
      return;
    }
    const controller = new AbortController();
    setFilingStatus("Consultando documentos en la SEC…");
    fetch(`/api/mercados/empresa?ticker=${encodeURIComponent(ticker)}`, { signal: controller.signal })
      .then(async (response) => {
        if (controller.signal.aborted) return;
        if (response.status === 404) {
          setFilingStatus("La SEC no devolvió una ficha para este ticker. Comprueba el símbolo y la bolsa.");
          return;
        }
        if (!response.ok) throw new Error("SEC unavailable");
        const data: Issuer = await response.json();
        if (controller.signal.aborted) return;
        if (requestedExchange && data.exchange && requestedExchange !== data.exchange.toUpperCase() && !fundSelected) {
          setFilingStatus("La bolsa ingresada no coincide con la ficha recuperada en EDGAR.");
          return;
        }
        if (!limited) reserve();
        setIssuer(publicIssuer ? {
          ...publicIssuer, ...data,
          name: data.fromBackup ? publicIssuer.name : data.name,
          filings: data.filings.length ? data.filings : publicIssuer.filings,
        } : data);
        setFilingStatus("");
      })
      .catch(() => { if (!controller.signal.aborted) setFilingStatus("La actualización de documentos de la SEC no está disponible en este momento."); });
    return () => controller.abort();
  }, [fundSelected, matchingExchange, odditySelected, profile, publicIssuer, requestedExchange, symbol, ticker]);

  const publicData = issuer ?? publicIssuer;
  const hasStory = Boolean(profile || odditySelected || fundSelected || publicData);
  const requestStory = !illustrated && /^[A-Z][A-Z0-9-]{0,11}$/.test(ticker)
    && matchingExchange && requestedExchange !== "OTC";
  const exchange = requestedExchange || issuer?.exchange?.toUpperCase();
  const generatedSymbol = exchange ? `${exchange}:${ticker}` : ticker;
  useEffect(() => {
    if (!requestStory) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ ticker });
    if (requestedExchange) query.set("exchange", requestedExchange);
    fetch(`/api/mercados/historia?${query}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.ok) {
          const story: GeneratedCompanyStory = await response.json();
          if (!controller.signal.aborted) setGenerated(story);
        } else if (!controller.signal.aborted) setStoryUnavailable(true);
      })
      .catch(() => { if (!controller.signal.aborted) setStoryUnavailable(true); });
    return () => controller.abort();
  }, [requestStory, requestedExchange, storyAttempt, ticker]);
  useEffect(() => {
    if (symbol) result.current?.focus({ preventScroll: true });
  }, [symbol]);
  return <section id="consultar-ticker" className="ai-market" aria-labelledby="ai-market-title">
    <p className="ve-kicker"><ChartCandlestick size={19} aria-hidden="true" /> Datos de mercado</p>
    <h2 id="ai-market-title">Consulta un ticker o empresa</h2>
    <p>Consulta un símbolo de EE. UU. para ver el gráfico y, cuando esté disponible, una historia sobre el negocio y su demanda.</p>
    <form className="ai-market-form" onSubmit={submit}>
      <label className="ve-search"><Search size={20} aria-hidden="true" /><input type="search" maxLength={44} aria-label="Ticker o nombre de empresa" placeholder="Ej. NASDAQ:ODD" value={input} onChange={(event) => setInput(event.target.value)} /></label>
      <button className="ve-cta" type="submit">Consultar ticker</button>
    </form>
    <div className="ai-market-samples" aria-label="Símbolos de ejemplo">{samples.map((sample) => <button key={sample} type="button" aria-pressed={symbol === sample} onClick={() => select(sample)}>{sample}</button>)}</div>
    {message && <p role="status">{message}</p>}
    {symbol && <div className="ai-market-result" ref={result} tabIndex={-1}>
      {illustrated ? <CompanyStory symbol={storySymbol} locale={locale} />
        : generated ? <CompanyStory symbol={generatedSymbol} locale={locale} generated={generated} />
        : requestStory ? <p className="ai-market-issuer" role="status">{storyUnavailable
          ? "La historia de esta empresa aún no está disponible. Puedes consultar el gráfico y los documentos públicos."
          : "Preparando una explicación de qué vende la empresa, quién paga y qué podría mover la demanda…"}</p>
        : profile && !blocked ? <TickerStory ticker={ticker} name={profile?.name ?? publicData?.name ?? ticker}
            sector={issuer?.sector} profile={profile} filings={publicData?.filings ?? []} />
          : !hasStory && <p className="ai-market-issuer" role="status">{filingStatus || "Buscando una ficha pública para este símbolo."}</p>}
      {odditySelected && !blocked && <a href={oddityStoryPath}>Explorar los escenarios y fuentes de ODDITY <ArrowUpRight size={15} aria-hidden="true" /></a>}
      <h3>Gráfico de {symbol}</h3>
      <iframe key={symbol} title={`Gráfico de ${symbol} en TradingView`} src={chartUrl(chartSymbol, locale)} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
      <a href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(chartSymbol)}`} target="_blank" rel="noopener noreferrer">Abrir gráfico en TradingView <ArrowUpRight size={15} aria-hidden="true" /></a>
      {hasStory && filingStatus && <p role="status">{filingStatus}</p>}
      {publicData && <IssuerDetails issuer={publicData} />}
      {blocked && <div className="ai-market-issuer"><a href={base + "/research/#planes-research"}>Ver planes de Research <ArrowUpRight size={15} aria-hidden="true" /></a></div>}
    </div>}
    <p className="ai-market-source"><a className="avs-reading-link" href={visualStoriesPath + "#historias-mercado"}>Entender volumen, indicadores y etapas en viñetas <ArrowUpRight size={16} aria-hidden="true" /></a></p>
    {!odditySelected && <p className="ai-market-source"><a className="avs-reading-link" href={visualStoriesPath + "#historia-fuentes"}>Cómo comprobar el periodo y la fuente de una cifra <ArrowUpRight size={16} aria-hidden="true" /></a></p>}
    <p className="ai-market-source">Precios de TradingView. La cobertura y el retraso varían por mercado. Documentos de EDGAR para emisores registrados en la SEC.</p>
  </section>;
}
