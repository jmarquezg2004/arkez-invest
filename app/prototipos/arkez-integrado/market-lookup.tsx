"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, ChartCandlestick, Search } from "lucide-react";

import { oddityStoryPath, visualStoriesPath } from "./routes";

type Issuer = {
  name: string; exchange?: string; sector?: string;
  filings: { form: string; date: string; href: string }[];
};

const samples = ["NASDAQ:ODD", "NYSE:NU", "NASDAQ:AAPL", "AMEX:SPY"];
const validSymbol = /^(?:[A-Z0-9_-]{1,20}:)?[A-Z0-9][A-Z0-9._!^=-]{0,22}$/;
function chartUrl(symbol: string) {
  const url = new URL("https://s.tradingview.com/widgetembed/");
  url.search = new URLSearchParams({
    symbol, interval: "D", theme: "dark", style: "1", locale: "es",
    timezone: "Etc/UTC", symboledit: "1", saveimage: "0", hideideas: "1", withdateranges: "1",
  }).toString();
  return url.href;
}

export function MarketLookup() {
  const [input, setInput] = useState("");
  const [symbol, setSymbol] = useState("");
  const [message, setMessage] = useState("");
  const [issuer, setIssuer] = useState<Issuer | null>(null);
  const [filingStatus, setFilingStatus] = useState("");

  useEffect(() => {
    const ticker = new URLSearchParams(window.location.search).get("ticker")?.toUpperCase() ?? "";
    if (validSymbol.test(ticker)) { setInput(ticker); setSymbol(ticker); }
  }, []);

  useEffect(() => {
    if (!symbol) return;
    const ticker = symbol.split(":").at(-1) ?? "";
    const exchange = symbol.includes(":") ? symbol.split(":")[0] : "";
    if (!/^[A-Z][A-Z0-9.-]{0,11}$/.test(ticker) || (exchange && !["NASDAQ", "NYSE", "AMEX", "NYSEARCA", "OTC", "CBOE", "BATS"].includes(exchange))) return;
    const controller = new AbortController();
    setFilingStatus("Consultando documentos en la SEC…");
    fetch(`/api/mercados/empresa?ticker=${encodeURIComponent(ticker)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setFilingStatus("La SEC no tiene una ficha para este ticker. Puedes usar el gráfico y comprobar la bolsa del instrumento.");
          return;
        }
        if (!response.ok) throw new Error("SEC unavailable");
        const data: Issuer = await response.json();
        if (controller.signal.aborted) return;
        setIssuer(data);
        setFilingStatus("");
      })
      .catch(() => { if (!controller.signal.aborted) setFilingStatus("La consulta de documentos no está disponible en este momento."); });
    return () => controller.abort();
  }, [symbol]);

  function select(ticker: string) {
    const next = ticker.trim().toUpperCase();
    if (!validSymbol.test(next)) {
      setMessage("Escribe un ticker como AAPL o incluye la bolsa, como NASDAQ:AAPL.");
      return;
    }
    setMessage("");
    setInput(next);
    if (next !== symbol) {
      setIssuer(null);
      setFilingStatus("");
      setSymbol(next);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    select(input);
  }

  const odditySelected = /^(?:NASDAQ:)?ODD$/.test(symbol);

  return <section id="consultar-ticker" className="ai-market" aria-labelledby="ai-market-title">
    <p className="ve-kicker"><ChartCandlestick size={19} aria-hidden="true" /> Datos de mercado</p>
    <h2 id="ai-market-title">Consulta cualquier ticker disponible</h2>
    <p>Busca un símbolo para abrir el gráfico y consultar documentos oficiales cuando estén disponibles.</p>
    <form className="ai-market-form" onSubmit={submit}>
      <label className="ve-search"><Search size={20} aria-hidden="true" /><input type="search" maxLength={44} aria-label="Ticker o bolsa y ticker" placeholder="Ej. NASDAQ:ODD" value={input} onChange={(event) => setInput(event.target.value)} /></label>
      <button className="ve-cta" type="submit">Consultar ticker</button>
    </form>
    <div className="ai-market-samples" aria-label="Símbolos de ejemplo">{samples.map((sample) => <button key={sample} type="button" aria-pressed={symbol === sample} onClick={() => select(sample)}>{sample}</button>)}</div>
    {message && <p role="status">{message}</p>}
    {symbol && <div className="ai-market-result">
      <h3>Gráfico de {symbol}</h3>
      <iframe key={symbol} title={`Gráfico de ${symbol} en TradingView`} src={chartUrl(symbol)} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
      <a href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`}>Abrir gráfico en TradingView <ArrowUpRight size={15} aria-hidden="true" /></a>
      {filingStatus && <p role="status">{filingStatus}</p>}
      {issuer && <div className="ai-market-issuer">
        <h3>{issuer.name}</h3>
        <p>{[issuer.exchange, issuer.sector].filter(Boolean).join(" · ")}</p>
        {issuer.filings.length ? <ul role="list">{issuer.filings.map(({ form, date, href }) => <li key={href}><a href={href}>{form} · <time dateTime={date}>{date}</time> <ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul>
          : <p>Sin documentos recientes de los tipos que muestra este buscador.</p>}
      </div>}
    </div>}
    <p className="ai-market-source"><a className="avs-reading-link" href={odditySelected ? oddityStoryPath : visualStoriesPath + "#historia-fuentes"}>
      {odditySelected ? "Cómo gana dinero ODDITY, en cuatro viñetas" : "Cómo comprobar el periodo y la fuente de una cifra"} <ArrowUpRight size={16} aria-hidden="true" />
    </a></p>
    <p className="ai-market-source">Precios de TradingView. La cobertura y el retraso varían por mercado. Documentos de EDGAR para emisores registrados en la SEC.</p>
  </section>;
}
