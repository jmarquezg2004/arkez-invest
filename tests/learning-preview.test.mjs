import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beginnerTopics, learningPath, learningQuestions } from "../app/prototipos/arkez-integrado/learning-path.ts";
import { createNewsPhoto, createPreviewNews } from "../scripts/preview-news.mjs";
import { createPreviewServer } from "../scripts/preview.mjs";
import { answerFromLibrary } from "../app/prototipos/arkez-integrado/isa-knowledge.ts";
import { directoryBatch, directoryGroups } from "../app/prototipos/arkez-integrado/news-mix.ts";
import { archivedHeadlines, directoryArchive } from "../scripts/news-archive.mjs";

test("ISA responde la consulta de transferencias desde el catálogo bilingüe", () => {
  const spanish = answerFromLibrary("Cómo se realiza una transferencia de criptomonedas.", "es");
  assert.match(spanish.message, /billetera.*firma/);
  assert.equal(spanish.href, "/research/visual-stories/#historia-tema-cripto");
  assert.match(answerFromLibrary("How do I send crypto?", "en").message, /wallet signs/);
  assert.match(answerFromLibrary("¿Qué es una transferencia de cripto?", "es").message, /identificador/);
  assert.match(answerFromLibrary("¿Qué es el interés compuesto?", "es").message, /USD 121/);
  assert.equal(answerFromLibrary("¿Qué es el teatro?", "es"), undefined);
  assert.equal(answerFromLibrary("¿Qué criptomoneda me recomiendas enviar?", "es"), undefined);
  assert.equal(answerFromLibrary("¿Qué es una criptomoneda y cómo funciona el interés compuesto?", "es"), undefined);
});

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
  assert.equal(requests, 14);
});

test("Actualidad conserva seis tarjetas y sustituye fuentes si falta la foto", () => {
  const archive = [...directoryArchive, ...archivedHeadlines];
  const live = [
    { source: "Yahoo Finanzas", href: "https://finance.yahoo.com/news/a", image: "yahoo-a" },
    { source: "Yahoo Finanzas", href: "https://finance.yahoo.com/news/b", image: "yahoo-b" },
    { source: "Cointelegraph", href: "https://cointelegraph.com/news/a", image: "coin" },
    { source: "CNBC", href: "https://www.cnbc.com/2026/11/27/a.html", image: "cnbc" },
  ];
  for (const broken of [[], ["yahoo-b", "coin"], ["yahoo-b", "coin", ...archive.filter((item) => item.source === "CoinGecko").map((item) => item.image)]]) {
    const groups = directoryGroups(live, archive, ({ image }) => Boolean(image && !broken.includes(image)));
    const expected = broken.length === 0 ? ["Yahoo Finanzas", "Yahoo Finanzas", "Cointelegraph"]
      : ["CNBC", "The Motley Fool", broken.length === 2 ? "CoinGecko" : "CoinMarketCap"];
    for (const batch of [directoryBatch(groups, 0), directoryBatch(groups, 1)]) {
      assert.deepEqual(batch.map(({ source }) => source), [...expected.slice(0,2), "The Wall Street Journal", "The Wall Street Journal", "Investing España", expected[2]]);
      assert.equal(new Set(batch.map(({ href }) => href)).size, 6);
      assert.ok(batch.every(({ image }) => image && !broken.includes(image)));
    }
  }
});

test("recupera la imagen editorial del artículo si el RSS de Yahoo no trae foto", async () => {
  const href = "https://finance.yahoo.com/markets/article/ejemplo.html";
  const image = "https://s.yimg.com/ny/api/res/example";
  const news = createPreviewNews({ enrich: true, load: async (url) => {
    if (url.href === href) return new Response(`<html><head>
      <meta content="https://example.org/untrusted.png" property="og:image">
      <meta content="${image}" property="og:image:secure_url"></head></html>`);
    return url.searchParams.get("rss_url")?.includes("feeds.finance.yahoo.com")
      ? Response.json({ status: "ok", items: [{ title: "Article", link: href, pubDate: "2026-11-27 12:00:00" }] })
      : new Response(null, { status: 404 });
  } });
  assert.equal((await news())[0].image, image);
});

test("Actualidad lee RSS de Yahoo o Cointelegraph si el conversor falla", async () => {
  const news = createPreviewNews({ load: async (url) => {
    if (url.hostname !== "cointelegraph.com") return new Response(null, { status: 503 });
    return new Response(`<rss><channel><item>
      <title><![CDATA[Noticia de prueba]]></title>
      <link>https://cointelegraph.com/news/prueba</link>
      <pubDate>Fri, 27 Nov 2026 12:00:00 GMT</pubDate>
      <media:content url="https://images.cointelegraph.com/image.jpg" />
    </item></channel></rss>`);
  } });
  assert.deepEqual(await news(), [{
    title: "Noticia de prueba", href: "https://cointelegraph.com/news/prueba", date: "2026-11-27T12:00:00.000Z",
    source: "Cointelegraph", image: "https://images.cointelegraph.com/image.jpg",
  }]);
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

test("Motley Fool toma enlaces de Trending News y adapta la foto del artículo al ancho de la tarjeta", async () => {
  const listing = "https://www.fool.com/trending-news/";
  const article = "https://www.fool.com/investing/2026/11/27/mercados/";
  const original = "https://cdn.content.foolcdn.com/images/production/mercados.jpg";
  const resized = `https://g.foolcdn.com/image/?op=resize&url=${encodeURIComponent(original)}&w=3840`;
  const news = createPreviewNews({ enrich: true, load: async (url) => {
    if (url.href === listing) return new Response(`<main>
      <a href="/investing/2026/11/27/ajeno/"><h3>Fuera de la lista</h3></a>
      <h2>Recent Articles</h2>
      <a href="/investing/2026/11/27/mercados/?source=trending"><h3>Mercados &amp; economía</h3><p>Resumen</p></a>
      <a href="https://example.com/investing/2026/11/27/ajeno/"><h3>Otro sitio</h3></a>
      </main>`);
    if (url.href === article) return new Response(`<head><meta property="og:image" content="${resized.replaceAll("&", "&amp;")}"></head>`);
    return new Response(null, { status: 403 });
  } });
  const [story, extra] = await news();
  assert.equal(extra, undefined);
  assert.equal(story.title, "Mercados & economía");
  assert.equal(story.href, article);
  assert.equal(story.source, "The Motley Fool");
  const photo = new URL(story.image);
  assert.equal(photo.hostname, "g.foolcdn.com");
  assert.equal(photo.searchParams.get("url"), original);
  assert.equal(photo.searchParams.get("w"), "960");
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

test("las noticias conservan los titulares necesarios para dos filas y los ordenan por publicación", async () => {
  const news = createPreviewNews({ load: async (url) => Response.json({
    status: "ok",
    items: url.searchParams.get("rss_url").includes("investing.com") ? [
      { title: "Primera", link: "https://es.investing.com/news/primera", pubDate: "2026-11-25 19:00:00" },
      { title: "Segunda", link: "https://es.investing.com/news/segunda", pubDate: "2026-11-25 08:00:00" },
      { title: "Tercera", link: "https://es.investing.com/news/tercera", pubDate: "2026-11-26 08:00:00" },
    ] : [],
  }) });
  assert.deepEqual((await news()).map(({ title }) => title), ["Tercera", "Primera", "Segunda"]);
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
