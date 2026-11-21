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
  "/contacto/", "/legal/privacidad/", "/legal/terminos/", "/legal/riesgos/", "/innovacion/",
  "/herramientas/", "/herramientas/interes-compuesto/", "/actualidad/", "/ecosistema/",
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

test("la portada prioriza servicios y calculadora y el laboratorio conserva sus cuatro ejercicios", () => {
  const html = read("/");
  assert.match(html, /Aprende a manejar mejor tu dinero y <span>tomar decisiones financieras con confianza\.<\/span>/);
  assert.match(html, /Cursos prácticos, herramientas gratuitas y orientación financiera para personas y empresas\./);
  assert.match(html, /href="\/servicios\/">Explorar servicios/);
  assert.match(html, /href="\/herramientas\/interes-compuesto\/">Probar calculadora/);
  assert.match(html, /brand\/prisma-980\.webp/);
  assert.match(html, /class="hero-plot"/);
  assert.match(html, /Lectura de mercados/);
  assert.match(html, /class="quick-calc"/);
  assert.match(html, /class="quick-trace"/);
  assert.match(html, /Probar el laboratorio financiero/);
  assert.match(html, /hub-preview hub-preview-home/);
  assert.match(html, /Filtra la fuente de datos/);
  assert.equal((html.match(/class="home-service-card"/g) ?? []).length, 3);
  assert.equal((html.match(/<time dateTime="/gi) ?? []).length, 2);
  assert.doesNotMatch(html, /role="tab"/);
  const tools = read("/herramientas/");
  for (const capability of ["Análisis de mercados", "Diversificación de inversiones", "Gestión del riesgo", "Tecnología aplicada"]) {
    assert.ok(tools.includes(`<h3>${capability}</h3>`), capability);
  }
  assert.equal((tools.match(/role="tab"/g) ?? []).length, 4);
  assert.match(read("/recursos/"), /href="\/herramientas\/interes-compuesto\/">Probar calculadora/);
});

test("las tres ofertas principales tienen destinos propios y consultoría diferenciada", () => {
  const home = read("/");
  const links = ["/servicios/educacion-financiera/", "/servicios/analisis-de-mercados/", "/para-quien/empresas/", "/servicios/consultoria-financiera/"];
  for (const href of links) {
    assert.ok(home.includes(`href="${href}"`), href);
    assert.match(read(href), /Qué incluye el servicio/);
    assert.match(read(href), /Modalidad/);
  }
  assert.match(read("/para-quien/empresas/"), /\?servicio=finanzas-empresariales/);
  for (const step of ["Diagnóstico", "Formación práctica", "Aplicación de herramientas", "Evaluación del aprendizaje"]) {
    assert.ok(read("/servicios/metodologia/").includes(`<h2>${step}</h2>`), step);
  }
});

test("actualidad distingue enlaces originales y el directorio publica categorías y cautelas", () => {
  const news = read("/actualidad/");
  assert.match(news, /Mercados y economía/);
  assert.match(news, /Tecnología financiera/);
  assert.match(news, /Educación y oportunidades/);
  assert.match(news, /href="\/recursos\/articulos\/"/);
  assert.equal((news.match(/<time dateTime="/gi) ?? []).length, 3);
  assert.match(read("/ecosistema/"), /sin afiliación ni recomendación comercial/);
  assert.match(read("/herramientas/interes-compuesto/"), /investor\.gov\/financial-tools-calculators\/calculators\/calculadora-de-interes-compuesto/);
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
  for (const route of routes.filter((route) => route !== "/contacto/" && route !== "/herramientas/interes-compuesto/")) {
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
    if (route.endsWith("/primeros-pasos/") || route.endsWith("/que-es-diversificar/") || route === "/innovacion/") {
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
  const previews = indexable ? [] : [
    "/prototipos/editorial/", "/prototipos/editorial/innovacion/",
    "/prototipos/interactiva/", "/prototipos/interactiva/innovacion/",
    "/prototipos/design-system-premium/", "/prototipos/arkez-experience/",
  ];
  assert.deepEqual(found.sort(), [...routes, ...previews].sort());
  for (const route of previews) {
    const html = read(route);
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/, route);
    assert.ok(!readFileSync(new URL("sitemap.xml", output), "utf8").includes(route), route);
    if (route === "/prototipos/arkez-experience/") {
      for (const id of ["ax-level-panel", "recorrido", "herramientas-arkez", "registro", "inmuebles", "mapa-ia"]) {
        assert.match(html, new RegExp(`id="${id}"`));
      }
      for (const label of ["Empieza", "Aplica", "Expande", "Reproducir cambios", "Reiniciar caminos", "Reproducir secuencia", "Reiniciar secuencia"]) {
        assert.ok(html.includes(label), label);
      }
      assert.match(html, /href="\/herramientas\/interes-compuesto\/"/);
      assert.match(html, /href="#caminos-arkez"[^>]*>Explorar los tres caminos/);
      assert.match(html, /href="#inmuebles"[^>]*>Probar el simulador/);
      assert.match(html, /aria-label="Secciones de Arkez Experience"/);
      assert.match(html, /aria-label="Escenarios de valor futuro"/);
      assert.match(html, /aria-label="Año de la simulación"/);
      assert.match(html, /class="ax-chart-reference"/);
      assert.match(html, /<dt>Gastos acumulados<\/dt>/);
      assert.doesNotMatch(html, /<script[^>]+src="https?:/);
    } else if (route === "/prototipos/design-system-premium/") {
      for (const name of ["dashboard", "ofertas", "herramientas-demo", "proyeccion", "recorrido", "iconografia", "lecturas"]) {
        assert.match(html, new RegExp(`id="${name}"`));
      }
      assert.equal((html.match(/class="px-service"/g) ?? []).length, 3);
      assert.doesNotMatch(html, /<script[^>]+src="https?:/);
    } else {
      assert.match(html, /href="\/prototipos\/preview\.css"/, route);
    }
  }
  for (const route of routes) assert.doesNotMatch(read(route), /href="\/prototipos\//, route);
});

test("Innovation Hub exporta las cinco categorías, contenidos y referencias al simulador", () => {
  const tools = read("/herramientas/");
  const hub = read("/innovacion/");
  assert.match(tools, /<section class="hub-preview" id="innovacion" aria-labelledby="innovation-heading"/);
  for (const id of ["portafolios", "defi", "ia", "academia", "ecosistema"]) {
    assert.ok(tools.includes(`id="hub-select-${id}"`));
    assert.ok(tools.includes(`href="/innovacion/#${id}"`));
    assert.ok(hub.includes(`id="${id}"`));
    assert.ok(hub.includes(`href="#${id}"`));
  }
  for (const html of [tools, hub]) {
    assert.match(html, /id="hub-weight"/);
    assert.match(html, /id="hub-shock"/);
    assert.match(html, /Distribución de activos/);
    assert.match(html, /Cartera de referencia/);
    assert.match(html, /Datos ficticios/);
  }
});
