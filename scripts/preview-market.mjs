import bundledMarketDirectory from "./market-directory.json" with { type: "json" };

const marketRoot = "/api/mercados/empresa";
const secIndex = "https://www.sec.gov/files/company_tickers_exchange.json";
export const secHeaders = { "User-Agent": "Arkez Invest Research (https://arkezinvest.com/)", Accept: "application/json" };
// Fallback snapshot of SEC ticker/CIK data, mirrored at revision d653ee1 of larsondg2000/SEC-10K-and-10Q-Reports.
const businessForms = ["10-K", "20-F", "40-F", "N-1A", "485BPOS", "N-CSR"];
const offeringForms = ["424B4", "S-1", "S-1/A", "F-1", "F-1/A"];
const quarterlyForms = ["10-Q", "6-K"];
const displayForms = [...businessForms, ...offeringForms, ...quarterlyForms, "8-K"];
export const normalizeSecSymbol = (ticker) => ticker.trim().toUpperCase().replaceAll(".", "-");

export function createMarketLookup({ load = fetch, now = Date.now, directory = bundledMarketDirectory } = {}) {
  const backup = new Map(directory.filter((row) => typeof row[2] === "string").map((row) => [normalizeSecSymbol(row[2]), row]));
  const cache = new Map();
  const retryAfter = new Map();
  let windowEnds = 0;
  let calls = 0;

  async function get(url, ttl) {
    const time = now();
    const previous = cache.get(url);
    if (previous && previous.expires > time) return previous.result;
    const host = new URL(url).hostname;
    if ((retryAfter.get(host) ?? 0) > time) throw new Error("SEC temporarily unavailable");
    if (time >= windowEnds) { windowEnds = time + 1000; calls = 0; }
    if (++calls > 5) throw new Error("SEC request limit");
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    const result = (async () => {
      const response = await load(url, { headers: secHeaders, signal: AbortSignal.timeout(2500) });
      if (!response.ok) {
        if ([403, 429, 503].includes(response.status)) retryAfter.set(host, now() + 60_000);
        throw new Error("SEC request failed");
      }
      return response.json();
    })();
    const entry = { expires: time + ttl, result };
    cache.set(url, entry);
    result.catch(() => { if (cache.get(url) === entry) cache.delete(url); });
    return result;
  }

  async function liveIssuer(symbol) {
    const index = await get(secIndex, 12 * 60 * 60_000);
    if (!Array.isArray(index.data)) throw new Error("SEC index unavailable");
    return index.data.find((row) => typeof row[2] === "string" && normalizeSecSymbol(row[2]) === symbol);
  }

  async function getFilings(cik) {
    const data = await get(`https://data.sec.gov/submissions/CIK${String(cik).padStart(10, "0")}.json`, 15 * 60_000);
    const recent = data.filings?.recent;
    if (!Array.isArray(recent?.form)) throw new Error("SEC filings unavailable");
    const filings = [];
    for (const [i, form] of recent.form.entries()) {
      if (!displayForms.includes(form)) continue;
      const number = recent.accessionNumber?.[i];
      const document = recent.primaryDocument?.[i];
      const date = recent.filingDate?.[i];
      if (!/^\d{10}-\d{2}-\d{6}$/.test(number ?? "") || !/^[a-z\d_-]+\.html?$/i.test(document ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) continue;
      filings.push({ form, date, href: `https://www.sec.gov/Archives/edgar/data/${cik}/${number.replaceAll("-", "")}/${document}` });
      if (filings.length >= 5 && filings.some(({ form }) => ["10-K", "20-F", "40-F", "N-1A", "485BPOS", "N-CSR"].includes(form))) break;
    }
    const storyFilings = [businessForms, offeringForms, quarterlyForms]
      .map((forms) => filings.find(({ form }) => forms.includes(form))).filter(Boolean);
    return { name: data.name, sector: data.sicDescription, filings: filings.slice(0, 5), storyFilings };
  }

  return async (url) => {
    const symbol = normalizeSecSymbol(url.searchParams.get("ticker") ?? "");
    const reply = (status, body) => Response.json(body, {
      status, headers: { "Cache-Control": status === 200 ? "public, max-age=120" : "no-store" },
    });
    if (!/^[A-Z0-9][A-Z0-9-]{0,11}$/.test(symbol)) return reply(400, { error: "ticker" });

    let row;
    let fromBackup = false;
    try {
      row = await liveIssuer(symbol);
    } catch {
      row = backup.get(symbol);
      fromBackup = true;
    }
    if (!row) return fromBackup ? reply(503, { error: "unavailable" }) : reply(404, { error: "not-found" });

    const [cik, name,, exchange] = row;
    if (!Number.isSafeInteger(cik) || cik <= 0 || typeof name !== "string") return reply(503, { error: "unavailable" });
    const edgar = `https://www.sec.gov/edgar/browse/?CIK=${cik}&owner=exclude`;
    const details = await getFilings(cik).catch(() => null);
    return reply(200, {
      symbol, name: details?.name || name, exchange, sector: details?.sector, edgar,
      storyFilings: details?.storyFilings, fromBackup, filingsUnavailable: !details, filings: details?.filings ?? [],
    });
  };
}
