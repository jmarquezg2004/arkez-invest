import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beginnerTopics, learningPath, learningQuestions } from "../app/prototipos/arkez-integrado/learning-path.ts";
import { createNewsPhoto, createPreviewNews } from "../scripts/preview-news.mjs";
import { createPreviewServer } from "../scripts/preview.mjs";

test("la ruta educativa valida las respuestas y selecciona recursos según el objetivo y el formato", () => {
  const base = { goal: "fundamentos", topic: "ahorro", level: "inicio", time: "hoy", format: "practica" };
  assert.equal(learningQuestions(base).length, 5);
  assert.equal(learningPath(base).first.path, "/herramientas/interes-compuesto/");
  assert.equal(learningPath(base).level, "Empieza");
  assert.equal(learningPath(base).story, "ahorro");
  assert.ok(Object.values(beginnerTopics).every(({ panels }) => panels.length === 4));
  assert.equal(learningPath({ ...base, format: "lectura" }).first.path, "/recursos/guias/primeros-pasos/");
  assert.equal(learningPath({ ...base, topic: "ia" }), null);
  const beginnerOptions = learningQuestions({ ...base, goal: "empresa" }).find(({ id }) => id === "topic").options;
  assert.equal(beginnerOptions.filter(([key]) => ["bolsa", "cripto", "venture", "fondos", "inmuebles", "depositos", "cuentas", "fiduciarios", "pensiones", "privado", "crowdfunding"].includes(key)).length, 11);
  const caseRoute = { ...base, topic: "crowdfunding", format: "caso" };
  assert.equal(learningPath({ ...caseRoute, focus: "infraestructura" }), null);
  assert.equal(learningPath({ ...caseRoute, focus: "infraestructura", company: "NVDA" }).first.path, "/explore/ecosistema-ia/?empresa=NVDA#empresas-cadena-ia");
  assert.equal(learningPath({ ...caseRoute, focus: "historia", story: "crowdfunding" }).first.path, "/research/visual-stories/#historia-tema-crowdfunding");
  const company = { ...base, goal: "empresa", topic: "consumo", format: "visual" };
  assert.equal(learningQuestions(company).length, 6);
  assert.equal(learningPath(company), null);
  assert.equal(learningPath({ ...company, focus: "relaciones" }).first.path, "/research/oddity/modelo/");
  assert.equal(learningPath({ ...company, focus: "riesgos" }).first.path, "/research/oddity/informe/");
  assert.equal(learningPath({ ...base, goal: "equipo", topic: "ia", time: "semanas" }).level, "Expande");
});

test("cada combinación válida enlaza a tres recursos distintos con destinos y anclas exportados", {
  skip: process.env.ARKEZ_LOCAL_PREVIEW !== "1",
}, () => {
  function verify(answers, checked = []) {
    const next = learningQuestions(answers).find(({ id }) => !checked.includes(id));
    if (next) {
      for (const [value] of next.options) verify({
        ...answers, [next.id]: value,
        ...(value === "infraestructura" ? { company: "NVDA" } : value === "historia" ? { story: "crowdfunding" } : {}),
      }, [...checked, next.id]);
      return;
    }
    const result = learningPath(answers);
    assert.equal(result.story, answers.focus === "historia" ? answers.story : answers.topic);
    assert.equal(beginnerTopics[result.story].panels.length, 4);
    const links = [result.first, ...result.next].map(({ path }) => path);
    assert.equal(new Set(links).size, 3);
    for (const link of links) {
      const [routeWithQuery, anchor] = link.split("#");
      const route = routeWithQuery.split("?")[0];
      const url = new URL(`../out/prototipos/arkez-integrado${route}index.html`, import.meta.url);
      const html = readFileSync(url, "utf8");
      if (anchor) assert.ok(html.includes(`id="${anchor}"`), link);
    }
  }
  verify({});
});

test("el feed de noticias ignora fuentes caídas, enlaces ajenos, HTML y duplicados", async () => {
  const link = "https://es.investing.com/news/example";
  const item = (title, href, date) => ({ title, link: href, pubDate: date });
  let requests = 0;
  const news = createPreviewNews({ load: async (url) => {
    requests += 1;
    if (!url.searchParams.get("rss_url").includes("investing.com")) throw new Error("Feed no disponible");
    return Response.json({ status: "ok", items: [
      { ...item("Anterior", link + "/old", "2026-11-20 13:00:00"), thumbnail: "https://example.org/imagen.jpg" },
      { ...item("S&amp;P", link + "?tracking=1", "2026-11-21 13:00:00"), enclosure: { link: "https://content-media.investing.com/news/ejemplo.jpg" } },
      item("Duplicado", link, "2026-11-19 13:00:00"),
      item("<b>HTML</b>", link, "2026-11-25 13:00:00"),
      item("Enlace ajeno", "https://example.org/", "2026-11-25 13:00:00"),
    ] });
  } });
  const results = await news();
  assert.deepEqual(results.map(({ title, href }) => [title, href]), [["S&P", link], ["Anterior", link + "/old"]]);
  assert.equal(results[0].image, "https://content-media.investing.com/news/ejemplo.jpg");
  assert.equal(results[1].image, undefined);
  assert.deepEqual(await news(), results);
  assert.equal(requests, 4);
});

test("recupera el src original de la descripción RSS sin mostrar su HTML", async () => {
  const news = createPreviewNews({ load: async (url) => Response.json({
    status: "ok",
    items: !url.searchParams.get("rss_url").includes("investing.com") ? [] : [
      {
        title: "Una noticia",
        link: "https://es.investing.com/news/una-noticia",
        pubDate: "2026-11-25 13:00:00",
        description: `<img src="https://example.org/no.jpg"><img data-src="https://content-media.investing.com/no.jpg" src='https://content-media.investing.com/news/original.jpg?w=960&amp;h=540'>`,
      },
    ],
  }) });
  const [story] = await news();
  assert.equal(story.image, "https://content-media.investing.com/news/original.jpg?w=960&h=540");
  assert.equal(Object.hasOwn(story, "description"), false);
});

test("la ruta local de noticias devuelve JSON y admite únicamente GET", async () => {
  const server = createPreviewServer({ news: async () => [] });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}/api/noticias/preview`;
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.deepEqual(await response.json(), []);
    assert.equal((await fetch(url, { method: "POST" })).status, 405);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("las noticias toman los dos primeros del RSS antes de ordenarlos como el sitio original", async () => {
  const news = createPreviewNews({ load: async (url) => Response.json({
    status: "ok",
    items: url.searchParams.get("rss_url").includes("investing.com") ? [
      { title: "Primera", link: "https://es.investing.com/news/primera", pubDate: "2026-11-25 19:00:00" },
      { title: "Segunda", link: "https://es.investing.com/news/segunda", pubDate: "2026-11-25 08:00:00" },
      { title: "Tercera", link: "https://es.investing.com/news/tercera", pubDate: "2026-11-26 08:00:00" },
    ] : [],
  }) });
  assert.deepEqual((await news()).map(({ title }) => title), ["Segunda", "Primera"]);
});


test("la ruta de fotos conserva los bytes de la fuente y rechaza imágenes ajenas", async () => {
  const original = "https://content-media.investing.com/news/original.jpg";
  const bytes = Uint8Array.of(255, 216, 255, 217);
  const photo = createNewsPhoto(async () => [{ image: original }], async (link, options) => {
    assert.equal(link, original);
    assert.equal(options.redirect, "error");
    return new Response(bytes, { headers: { "Content-Type": "image/jpeg" } });
  });
  const request = (link) => photo(new URL("https://example.com/?url=" + encodeURIComponent(link)), "GET");
  assert.equal((await request(original + "?different=1")).status, 404);
  assert.equal((await request("https://example.com/news/original.jpg")).status, 404);
  const response = await request(original);
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});
