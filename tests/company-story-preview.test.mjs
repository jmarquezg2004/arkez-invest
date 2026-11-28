import assert from "node:assert/strict";
import test from "node:test";

import { createCompanyStoryHandler } from "../scripts/preview-company-story.mjs";

test("genera una historia bilingüe con fuente SEC para un ticker fuera de las historias editoriales", async () => {
  const publicFiling = "https://www.sec.gov/Archives/edgar/data/21344/000002134426000003/ko.htm";
  const request = new Request("https://example.com/api/mercados/historia?ticker=KO");
  const modelCalls = [];
  const copy = {
    title: "Coca-Cola",
    prompts: ["A", "B", "C", "D"],
    captions: ["a", "b", "c", "d"],
    watch: ["a", "b", "c"],
    takeaway: "Learn how the business works.",
  };
  const env = { AI: { run: async (model, input) => {
    modelCalls.push(model);
    if (model.includes("llama")) {
      assert.match(input.messages[1].content, /beverage concentrates/);
      assert.match(input.messages[0].content, /future demand as a conditional scenario/);
      assert.match(input.messages[0].content, /Skip SEC, EDGAR/);
      return { response: { es: copy, en: copy, scenes: ["Factory", "Bottle shop", "Crate", "Receipt"] } };
    }
    assert.match(input.prompt, /top left: Factory/);
    return { image: "/9j/AAAA" };
  } } };
  const visible = new Map();
  const lookup = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "KO", exchange: "NYSE", name: "Coca-Cola", storyFilings: [{ href: publicFiling, form: "10-K" }] }),
    load: async (url) => {
      assert.equal(url.href, publicFiling);
      return new Response(`<nav>Item 1. Business 1 Item 1A. Risk Factors 15</nav>
        <main><h2>Item 1. Business</h2><p>${"The company sells beverage concentrates. ".repeat(35)}</p>
        <h2>Item 1A. Risk Factors</h2></main>`);
    },
    getCache: () => ({
      match: async (key) => visible.get(key.url)?.clone(),
      put: async (key, response) => { visible.set(key.url, response); },
    }),
  });
  const responses = await Promise.all([lookup(request, env), lookup(request, env)]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { es: copy, en: copy, source: publicFiling, image: "data:image/jpeg;base64,/9j/AAAA" });
  }
  assert.equal((await lookup(request, env)).status, 200);
  assert.equal(modelCalls.length, 2);
});

test("devuelve un estado de indisponibilidad cuando faltan Workers AI o el informe", async () => {
  const request = new Request("https://example.com/api/mercados/historia?ticker=KO");
  const lookup = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "KO", exchange: "NYSE" }),
    getCache: () => undefined,
  });
  assert.equal((await lookup(request, {})).status, 503);
  assert.equal((await lookup(request, { AI: { run: () => assert.fail("No se debe generar contenido sin el informe") } })).status, 422);
  assert.equal((await lookup(new Request(request.url, { headers: { "Sec-Fetch-Site": "cross-site" } }), {})).status, 403);
});

test("usa el prospecto de una empresa recién listada y conserva la explicación si falla la ilustración", async () => {
  const publicFiling = "https://www.sec.gov/Archives/edgar/data/1181412/000162828026042639/spaceexplorationtechnologi.htm";
  const request = new Request("https://example.com/api/mercados/historia?ticker=SPCX");
  const copy = {
    title: "SpaceX",
    prompts: ["A", "B", "C", "D"], captions: ["a", "b", "c", "d"], watch: ["a", "b", "c"], takeaway: "Learn how it works.",
  };
  const lookup = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "SPCX", exchange: "Nasdaq", name: "SpaceX", storyFilings: [{ href: publicFiling, form: "424B4" }] }),
    load: async () => new Response(`<main><h2>Prospectus Summary</h2><p>${"Households pay Starlink for satellite internet. ".repeat(25)}</p></main>`),
    getCache: () => undefined,
  });
  const response = await lookup(request, { AI: { run: async (model, input) => {
    if (!model.includes("llama")) throw new Error("Image unavailable");
    assert.match(input.messages[1].content, /Households pay Starlink/);
    return { response: { es: copy, en: copy, scenes: ["Rocket", "House", "Ship", "Satellite"] } };
  } } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { es: copy, en: copy, source: publicFiling });
});

test("recupera una explicación del comunicado del emisor cuando el informe no describe el negocio", async () => {
  const root = "https://www.sec.gov/Archives/edgar/data/1234/000000123426000001/";
  const sources = [];
  const copy = {
    title: "Example Grocer",
    prompts: ["A", "B", "C", "D"], captions: ["a", "b", "c", "d"], watch: ["a", "b", "c"], takeaway: "Groceries.",
  };
  const history = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "GRO", exchange: "NYSE", storyFilings: [
      { href: root + "short.htm", form: "40-F" },
      { href: root + "report.htm", form: "8-K" },
    ] }),
    load: async (url) => {
      sources.push(url.href);
      const body = {
        "/short.htm": "See attached documents.",
        "/report.htm": '<a href="../x.htm">99.1</a><a href="earnings.htm">99.1</a>',
        "/earnings.htm": `<h2>Business Highlights</h2><p>${"Shoppers buy fresh produce and food from the company. ".repeat(20)}</p>`,
      };
      return new Response(body[url.pathname.slice(url.pathname.lastIndexOf("/"))]);
    },
    getCache: () => undefined,
  });
  const env = { AI: { run: async (model, input) => {
    if (!model.includes("llama")) return { image: "/9j/AAAA" };
    assert.match(input.messages[1].content, /Shoppers buy fresh produce/);
    return { response: { es: copy, en: copy, scenes: ["Market", "Cashier", "Delivery", "Store"] } };
  } } };
  assert.equal((await history(new Request("https://example.com/api/mercados/historia?ticker=GRO&exchange=NASDAQ"), env)).status, 404);
  assert.deepEqual(sources, []);
  const response = await history(new Request("https://example.com/api/mercados/historia?ticker=GRO&exchange=NYSE"), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).source, root + "earnings.htm");
  assert.deepEqual(sources, [root + "short.htm", root + "report.htm", root + "earnings.htm"]);
});

test("usa evidencia alternativa solo si el identificador coincide con el emisor", async () => {
  const copy = {
    title: "Example", prompts: ["A", "B", "C", "D"], captions: ["a", "b", "c", "d"], watch: ["a", "b", "c"], takeaway: "Example.",
  };
  const query = new Request("https://example.com/api/mercados/historia?ticker=MU");
  let candidateCik = "0000723125";
  const history = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "MU", exchange: "Nasdaq", name: "Micron Technology Inc", edgar: "https://www.sec.gov/edgar/browse/?CIK=723125" }),
    load: async (url) => url.hostname === "en.wikipedia.org"
      ? Response.json({ query: { pages: [{ pageid: 123, pageprops: { wikibase_item: "Q42" }, extract: "Micron sells memory chips. ".repeat(8) }] } })
      : Response.json({ entities: { Q42: { claims: { P5531: [{ mainsnak: { datavalue: { value: candidateCik } } }] } } } }),
    getCache: () => undefined,
  });
  const env = { AI: { run: async (model, input) => {
    if (!model.includes("llama")) return {};
    assert.match(input.messages[1].content, /Micron sells memory chips/);
    return { response: { es: copy, en: copy, scenes: ["Memory", "Computer", "Factory", "Order"] } };
  } } };
  const response = await history(query, env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).source, "https://en.wikipedia.org/?curid=123");
  candidateCik = "999";
  assert.equal((await history(query, env)).status, 422);
});

test("recupera un borrador inválido y acepta JSON de la segunda generación", async () => {
  const source = "https://www.sec.gov/Archives/edgar/data/1571996/000157199626000001/dell.htm";
  const history = createCompanyStoryHandler({
    lookup: async () => Response.json({ symbol: "DELL", exchange: "NYSE", name: "Dell Technologies", storyFilings: [{ form: "10-K", href: source }] }),
    load: async () => new Response(`<h2>Item 1. Business</h2><p>${"The company sells servers and computers. ".repeat(30)}</p><h2>Item 1A. Risk Factors</h2>`),
    getCache: () => undefined,
  });
  const copy = {
    title: "Dell Technologies",
    prompts: ["Product?", "Who pays?", "More orders?", "What changes?"],
    captions: ["Dell sells servers.", "Companies buy its servers.", "More workloads could raise demand.", "More orders would support that expectation."],
    watch: ["Orders", "Customers", "Costs"],
    takeaway: "Businesses pay for computers and servers.",
  };
  const calls = [];
  const env = { AI: { run: async (model) => {
    calls.push(model);
    if (model.includes("8b")) return { response: "invalid JSON" };
    if (model.includes("70b")) return { response: "```json\n" + JSON.stringify({ es: copy, en: copy, scenes: ["Server", "Buyer", "Orders", "Factory"] }) + "\n```" };
    return { image: "/9j/AAAA" };
  } } };
  const result = await history(new Request("https://example.com/api/mercados/historia?ticker=DELL"), env);
  assert.equal(result.status, 200);
  assert.equal((await result.json()).source, source);
  assert.equal(calls.length, 3);
});
