import bundledMarketDirectory from "./market-directory.json" with { type: "json" };

const marketRoot = "/api/mercados/empresa";
const secIndex = "https://www.sec.gov/files/company_tickers_exchange.json";
export const secHeaders = { "User-Agent": "Arkez Invest Research (https://arkezinvest.com/)", Accept: "application/json" };
// Fallback snapshot of SEC ticker/CIK data, mirrored at revision d653ee1 of larsondg2000/SEC-10K-and-10Q-Reports.
const businessForms = ["10-K", "20-F", "40-F", "N-1A", "485BPOS", "N-CSR"];
const offeringForms = ["424B4", "S-1", "S-1/A", "F-1", "F-1/A"];
const quarterlyForms = ["10-Q", "6-K"];
const displayForms = [...businessForms, ...offeringForms, ...quarterlyForms, "8-K"];
const normalizeIssuerName = (name) => name.normalize("NFKD").replace(/\p{M}/gu, "")
  .toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim()
  .replace(/(?: (?:CORP(?:ORATION)?|INC(?:ORPORATED)?|LIMITED|LTD|PLC|CO(?:MPANY)?))+$/, "");

export const normalizeSecSymbol = (ticker) => ticker.trim().toUpperCase().replaceAll(".", "-");

export function createMarketLookup({ load = fetch, now = Date.now, directory = bundledMarketDirectory } = {}) {
  const backup = new Map(directory.filter((row) => typeof row[2] === "string").map((row) => [normalizeSecSymbol(row[2]), row]));
  function findIssuer(rows, symbol, name) {
    const exact = rows.find((row) => typeof row[2] === "string" && normalizeSecSymbol(row[2]) === symbol);
    if (exact || !name) return exact;
    const matches = rows.filter((row) => typeof row[1] === "string" && normalizeIssuerName(row[1]) === name);
    if (new Set(matches.map(([cik]) => cik)).size !== 1) return undefined;
    return matches.find((row) => typeof row[3] === "string" && /^(Nasdaq|NYSE|Cboe|NYSE Arca|NYSE American)$/i.test(row[3]));
  }
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

  async function liveIssuer(symbol, name) {
    const index = await get(secIndex, 12 * 60 * 60_000);
    if (!Array.isArray(index.data)) throw new Error("SEC index unavailable");
    return findIssuer(index.data, symbol, name);
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
      const earnings = form === "8-K" && recent.items?.[i]?.split(",").some((item) => item.trim() === "2.02");
      filings.push({ form, date, ...(earnings && { earnings }), href: `https://www.sec.gov/Archives/edgar/data/${cik}/${number.replaceAll("-", "")}/${document}` });

    }
    const storyFilings = [
      filings.find(({ form }) => businessForms.includes(form)),
      filings.find(({ form }) => offeringForms.includes(form)),
      filings.find(({ form }) => quarterlyForms.includes(form)),
      filings.find(({ earnings }) => earnings),
    ].filter(Boolean);
    return { name: data.name, sector: data.sicDescription, filings: filings.slice(0, 5), storyFilings };
  }

  return async (url) => {
    const input = url.searchParams.get("ticker")?.trim() ?? "";
    const symbol = normalizeSecSymbol(input);
    const name = url.searchParams.has("resolve") && input.length <= 44 ? normalizeIssuerName(input) : "";
    const reply = (status, body) => Response.json(body, {
      status, headers: { "Cache-Control": status === 200 ? "public, max-age=120" : "no-store" },
    });
    if (!name && !/^[A-Z0-9][A-Z0-9-]{0,11}$/.test(symbol)) return reply(400, { error: "ticker" });

    let row;
    let fromBackup = false;
    try {
      row = await liveIssuer(symbol, name);
    } catch {
      row = backup.get(symbol) ?? (name ? findIssuer(directory, symbol, name) : undefined);
      fromBackup = true;
    }
    if (!row) return fromBackup ? reply(503, { error: "unavailable" }) : reply(404, { error: "not-found" });

    const [cik, issuerName, listedTicker, exchange] = row;
    if (!Number.isSafeInteger(cik) || cik <= 0 || typeof issuerName !== "string") return reply(503, { error: "unavailable" });
    const edgar = `https://www.sec.gov/edgar/browse/?CIK=${cik}&owner=exclude`;
    const details = url.searchParams.has("resolve") ? null : await getFilings(cik).catch(() => null);
    return reply(200, {
      symbol: normalizeSecSymbol(listedTicker), name: details?.name || issuerName, exchange, sector: details?.sector, edgar,
      storyFilings: details?.storyFilings, fromBackup, filingsUnavailable: !details, filings: details?.filings ?? [],
    });
  };
}
