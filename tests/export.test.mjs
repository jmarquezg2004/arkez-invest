import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { sep } from "node:path";
import { test } from "node:test";

const indexable = process.env.ARKEZ_INDEXABLE === "1";
const output = new URL("../out/", import.meta.url);
const routes = [
  "/", "/servicios/", "/servicios/educacion-financiera/", "/servicios/analisis-de-mercados/", "/servicios/formacion-practica/",
  "/servicios/consultoria-financiera/", "/servicios/metodologia/",
  "/para-quien/", "/para-quien/personas/", "/para-quien/empresas/",
  "/recursos/", "/recursos/guias/", "/recursos/guias/primeros-pasos/",
  "/recursos/articulos/", "/recursos/articulos/que-es-diversificar/", "/recursos/preguntas-frecuentes/",
  "/nosotros/", "/nosotros/mision-y-equipo/", "/nosotros/transparencia/",
  "/contacto/", "/legal/privacidad/", "/legal/terminos/", "/legal/riesgos/",
];

function pagePath(route) {
  return new URL(`.${route}index.html`, output);
}

function read(route) {
  return readFileSync(pagePath(route), "utf8");
}

test("cada ruta corporativa se genera con un título, un h1 y canonical propios", () => {
  const titles = new Set();
  const descriptions = new Set();
  const headings = new Set();
  for (const route of routes) {
    const html = read(route);
    assert.match(html, /<html lang="es"/, route);
    assert.match(html, /<main id="contenido"/, route);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, route);
    assert.ok(html.includes(`href="https://arkezinvest.com${route}"`), route);
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(description && description.length >= 140 && description.length <= 160 && !descriptions.has(description), route);
    descriptions.add(description);
    assert.ok(html.includes(`<meta name="robots" content="${indexable ? "index, follow" : "noindex, nofollow"}"`), route);
    assert.match(html, /property="og:image" content="https:\/\/arkezinvest.com\/brand\/share.png"/, route);
    assert.match(html, /name="twitter:card" content="summary_large_image"/, route);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title && title.length >= 50 && title.length <= 60 && !titles.has(title), `Título ausente, duplicado o fuera de rango en ${route}: ${title}`);
    titles.add(title);
    const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, "");
    assert.ok(heading && !headings.has(heading), route);
    headings.add(heading);
    let previous = 0;
    for (const [, level] of html.matchAll(/<h([1-6])(?:\s|>)/g)) {
      assert.ok(Number(level) <= previous + 1, `Salto de jerarquía en ${route}`);
      previous = Number(level);
    }
  }
});

test("enlaces internos, activos y anclas históricas resuelven en la exportación", () => {
  for (const route of routes) {
    const html = read(route);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const url = new URL(href, "https://arkezinvest.com");
      const file = url.pathname.endsWith("/") ? pagePath(url.pathname) : new URL(`.${url.pathname}`, output);
      assert.ok(existsSync(file), `${href} en ${route}`);
      if (url.hash && url.pathname.endsWith("/")) {
        assert.ok(read(url.pathname).includes(`id="${url.hash.slice(1)}"`), `${href} en ${route}`);
      }
    }
  }
  for (const id of ["mision", "portafolio", "clientes", "noticias", "contacto"]) {
    assert.ok(read("/").includes(`id="${id}"`), id);
  }
});

test("la portada presenta el posicionamiento, los servicios y los cuatro ejercicios educativos", () => {
  const html = read("/");
  assert.match(html, /Conocimiento financiero <span>para tomar mejores decisiones\.<\/span>/);
  assert.match(html, /Formación, análisis de mercados y herramientas tecnológicas para fortalecer tus capacidades financieras y de inversión\./);
  assert.match(html, /href="\/servicios\/">Explorar servicios/);
  assert.match(html, /href="\/nosotros\/">Conoce Arkez/);
  assert.match(html, /class="hero-guide" href="\/recursos\/guias\/primeros-pasos\/"/);
  for (const capability of ["Análisis de mercados", "Diversificación de inversiones", "Gestión del riesgo", "Tecnología aplicada"]) {
    assert.ok(html.includes(`<h3>${capability}</h3>`), capability);
  }
  assert.match(html, /Gráficos ilustrativos con fines educativos/);
  assert.match(html, /brand\/prisma-980\.webp/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 4);
});

test("la portada enlaza los servicios y públicos y comparte los cuatro pasos metodológicos", () => {
  const home = read("/");
  const methodology = read("/servicios/metodologia/");
  for (const id of ["educacion-financiera", "analisis-de-mercados", "formacion-practica", "consultoria-financiera"]) {
    assert.ok(home.includes(`href="/servicios/${id}/"`), id);
    assert.ok(read("/servicios/").includes(`id="${id}"`), id);
  }
  assert.match(home, /href="\/para-quien\/personas\/" class="audience-link"/);
  assert.match(home, /href="\/para-quien\/empresas\/" class="audience-link"/);
  for (const step of ["Diagnóstico", "Formación práctica", "Aplicación de herramientas", "Evaluación del aprendizaje"]) {
    assert.ok(home.includes(`<h3>${step}</h3>`), step);
    assert.ok(methodology.includes(`<h2>${step}</h2>`), step);
  }
});

test("cada servicio tiene contenido propio, preguntas y una consulta con el servicio preseleccionado", () => {
  const indexes = read("/servicios/");
  const slugs = ["educacion-financiera", "analisis-de-mercados", "formacion-practica", "consultoria-financiera"];
  for (const slug of slugs) {
    const route = `/servicios/${slug}/`;
    const page = read(route);
    assert.ok(indexes.includes(`href="${route}"`), route);
    assert.match(page, /<h2>Beneficios/);
    assert.match(page, /<h2>A quién/);
    assert.match(page, /<h2>(?:Metodología|Cómo trabajamos)/);
    assert.match(page, /<h2[^>]*>Preguntas y respuestas<\/h2>/);
    assert.ok(page.includes(`href="/contacto/?servicio=${slug}"`), route);
    const schema = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    assert.ok(schema.some((entry) => entry["@type"] === "Service" && entry.url === `https://arkezinvest.com${route}`));
  }

  for (const route of routes) {
    const main = read(route).match(/<main[\s\S]*?<\/main>/)?.[0];
    const content = main?.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    assert.doesNotMatch(content ?? "", /href="\/servicios\/#(?:educacion-financiera|analisis-de-mercados|formacion-practica|consultoria-financiera)"/, route);
    for (const [, link] of (content ?? "").matchAll(/<a\b[^>]*?\bhref="([^"]+)"/g)) {
      assert.notEqual(link, "#", route);
      assert.notEqual(link, route, route);
    }
  }
});

test("el contacto de prueba carece de atributos que serialicen datos personales", () => {
  const legacy = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const html of [...routes.map(read), legacy]) {
    assert.doesNotMatch(html, /<iframe\b|formspree\.io|rss2json\.com|raw\.githubusercontent\.com|fonts\.googleapis\.com/i);
    assert.doesNotMatch(html, /<script[^>]*src="https?:\/\//i);
  }
  for (const route of routes.filter((route) => route !== "/contacto/")) {
    assert.doesNotMatch(read(route), /<form\b/);
  }
  const form = read("/contacto/").match(/<form[\s\S]*?<\/form>/)?.[0];
  assert.ok(form);
  assert.match(form, /method="post"/);
  assert.match(form, /id="contact-email"/);
  assert.doesNotMatch(form, /\bname=/);
});

test("datos estructurados coherentes con servicios y autoría editorial visibles", () => {
  for (const route of routes) {
    const html = read(route);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, route);
    const graph = JSON.parse(json)["@graph"];
    const types = graph.map((entry) => entry["@type"]);
    assert.ok(types.includes("Organization") && types.includes("WebSite"), route);
    if (route !== "/") {
      const trail = graph.find((entry) => entry["@type"] === "BreadcrumbList").itemListElement;
      assert.equal(trail.at(-1).item, `https://arkezinvest.com${route}`);
    }
    if (route === "/servicios/") assert.equal(types.filter((type) => type === "Service").length, 4);
    if (route.endsWith("/primeros-pasos/") || route.endsWith("/que-es-diversificar/")) {
      const article = graph.find((entry) => entry["@type"] === "Article");
      assert.ok(article.author["@id"].endsWith("#organizacion"));
      assert.match(html, new RegExp(`datetime="${article.dateModified}"`, "i"));
      for (const source of article.citation) assert.ok(html.includes(`href="${source}"`));
    }
  }
});

test("la exportación incluye 404, sitemap y robots acordes al perfil", () => {
  const file = (path) => readFileSync(new URL(path, output), "utf8");
  assert.match(file("404.html"), /Página no encontrada/);
  const robots = file("robots.txt");
  if (indexable) {
    assert.match(robots, /Allow: \//);
    assert.match(robots, /Sitemap: https:\/\/arkezinvest.com\/sitemap.xml/);
  } else {
    assert.match(robots, /Disallow: \//);
  }
  const sitemap = file("sitemap.xml");
  for (const route of routes) {
    assert.ok(sitemap.includes(`<loc>https://arkezinvest.com${route}</loc>`), route);
  }
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, routes.length);
});

test("el catálogo de rutas cubre todas las páginas exportadas", () => {
  const files = readdirSync(output, { recursive: true }).map((file) => file.split(sep).join("/"));
  const found = files.filter((file) => file === "index.html" || file.endsWith("/index.html"))
    .map((file) => `/${file.replace(/index\.html$/, "")}`)
    .filter((route) => route !== "/404/" && route !== "/_not-found/");
  assert.deepEqual(found.sort(), [...routes].sort());
});
