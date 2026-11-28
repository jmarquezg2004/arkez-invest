import assert from "node:assert/strict";
import test from "node:test";
import { createMarketLookup } from "../scripts/preview-market.mjs";
import { contentPolicy, previewPolicyOptions } from "../scripts/pages-headers.mjs";

test("EDGAR acepta tickers fuera del catálogo y enlaza solo a documentos válidos", async () => {
  const calls = [];
  const lookup = createMarketLookup({ load: async (url) => {
    calls.push(url);
    if (url.includes("company_tickers")) return Response.json({ data: [[1652044, "Alphabet", "GOOG", "Nasdaq"]] });
    assert.equal(url, "https://data.sec.gov/submissions/CIK0001652044.json");
    return Response.json({ name: "Alphabet Inc.", filings: { recent: {
      form: ["10-Q", "10-K"], filingDate: ["2026-10-25", "2026-03-03"],
      accessionNumber: ["0001652044-26-000003", "0001652044-26-000001"],
      primaryDocument: ["goog.htm", "../redirect.htm"],
    } } });
  } });
  const request = (ticker) => lookup(new URL("https://example.com/api/mercados/empresa?ticker=" + encodeURIComponent(ticker)));
  assert.equal((await request("../bad")).status, 400);
  assert.equal((await request("unknown")).status, 404);
  const result = await (await request(" goog ")).json();
  assert.equal(result.name, "Alphabet Inc.");
  assert.deepEqual(result.filings.map(({ href }) => href), ["https://www.sec.gov/Archives/edgar/data/1652044/000165204426000003/goog.htm"]);
  await request("GOOG");
  assert.equal(calls.length, 2);
});

test("un fallo del directorio o de los documentos de la SEC conserva la ficha verificable", async () => {
  const lookup = createMarketLookup({ load: async () => new Response(null, { status: 429 }) });
  const response = await lookup(new URL("https://example.com/?ticker=TGLS"));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.exchange, "NYSE");
  assert.equal(result.edgar, "https://www.sec.gov/edgar/browse/?CIK=1534675&owner=exclude");
  assert.equal(result.fromBackup, true);
  assert.equal(result.filingsUnavailable, true);
  assert.deepEqual(result.filings, []);
  assert.equal((await lookup(new URL("https://example.com/?ticker=UNKNOWN"))).status, 503);
});

test("el directorio en vivo conserva los símbolos nuevos aunque fallen sus documentos", async () => {
  const lookup = createMarketLookup({
    directory: [],
    load: async (url) => url.includes("company_tickers")
      ? Response.json({ data: [[1579878, "Figma, Inc.", "FIG", "NYSE"]] })
      : new Response(null, { status: 403 }),
  });
  const result = await (await lookup(new URL("https://example.com/?ticker=FIG"))).json();
  assert.equal(result.name, "Figma, Inc.");
  assert.equal(result.fromBackup, false);
  assert.equal(result.filingsUnavailable, true);
});

test("solo Explore y Research permiten el marco externo de TradingView", () => {
  for (const route of ["explore/", "research/", "contacto/"]) {
    const policy = contentPolicy([], previewPolicyOptions("/prototipos/arkez-integrado/" + route));
    assert.equal(policy.includes("frame-src https://s.tradingview.com"), route !== "contacto/");
    assert.match(policy, /frame-ancestors 'none'/);
    assert.doesNotMatch(policy, /script-src[^;]*tradingview/);
  }
});
