const marketRoot = "/api/mercados/empresa";
const secHeaders = { "User-Agent": "Arkez Invest Research (https://arkezinvest.com/)", Accept: "application/json" };

export function createMarketLookup({ load = fetch, now = Date.now } = {}) {
  const cache = new Map();
  let windowEnds = 0;
  let calls = 0;

  async function get(url, ttl) {
    const time = now();
    const previous = cache.get(url);
    if (previous && previous.expires > time) return previous.result;
    if (time >= windowEnds) { windowEnds = time + 1000; calls = 0; }
    if (++calls > 5) throw new Error("SEC request limit");
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    const result = (async () => {
      const response = await load(url, { headers: secHeaders, redirect: "error", signal: AbortSignal.timeout(5500) });
      if (!response.ok) throw new Error("SEC request failed");
      return response.json();
    })();
    const entry = { expires: time + ttl, result };
    cache.set(url, entry);
    result.catch(() => { if (cache.get(url) === entry) cache.delete(url); });
    return result;
  }

  return async (url) => {
    const symbol = (url.searchParams.get("ticker") ?? "").trim().toUpperCase().replaceAll(".", "-");
    const reply = (status, body) => Response.json(body, {
      status, headers: { "Cache-Control": status === 200 ? "public, max-age=120" : "no-store" },
    });
    if (!/^[A-Z0-9][A-Z0-9-]{0,11}$/.test(symbol)) return reply(400, { error: "ticker" });
    try {
      const index = await get("https://www.sec.gov/files/company_tickers_exchange.json", 12 * 60 * 60_000);
      if (!Array.isArray(index.data)) throw new Error("SEC index unavailable");
      const row = index.data.find((entry) => entry[2] === symbol);
      if (!row) return reply(404, { error: "not-found" });
      const [cik, name,, exchange] = row;
      if (!Number.isSafeInteger(cik) || cik <= 0) throw new Error("Invalid CIK");
      const data = await get(`https://data.sec.gov/submissions/CIK${String(cik).padStart(10, "0")}.json`, 15 * 60_000);
      const recent = data.filings?.recent;
      if (!Array.isArray(recent?.form)) throw new Error("SEC filings unavailable");
      const filings = [];
      for (const [i, form] of recent.form.entries()) {
        if (!["10-K", "10-Q", "20-F", "40-F", "8-K", "6-K"].includes(form)) continue;
        const number = recent.accessionNumber?.[i];
        const document = recent.primaryDocument?.[i];
        const date = recent.filingDate?.[i];
        if (!/^\d{10}-\d{2}-\d{6}$/.test(number ?? "") || !/^[a-z\d_-]+\.html?$/i.test(document ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) continue;
        filings.push({ form, date, href: `https://www.sec.gov/Archives/edgar/data/${cik}/${number.replaceAll("-", "")}/${document}` });
        if (filings.length === 5) break;
      }
      return reply(200, { symbol, name: data.name ?? name, exchange, sector: data.sicDescription, filings });
    } catch {
      return reply(503, { error: "unavailable" });
    }
  };
}
