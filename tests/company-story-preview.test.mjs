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
