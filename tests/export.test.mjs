import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { sep } from "node:path";
import { test } from "node:test";

const output = new URL("../out/", import.meta.url);
const routes = [
  "/", "/servicios/", "/servicios/educacion-financiera/", "/servicios/metodologia/",
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
  for (const route of routes) {
    const html = read(route);
    assert.match(html, /<html lang="es"/, route);
    assert.match(html, /<main id="contenido"/, route);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, route);
    assert.ok(html.includes(`href="https://arkezinvest.com${route}"`), route);
    assert.match(html, /<meta name="description" content="[^"]+"/, route);
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/, route);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `Título ausente o duplicado en ${route}`);
    titles.add(title);
  }
});

test("enlaces internos, activos y anclas históricas resuelven en la exportación", () => {
  for (const route of routes) {
    const html = read(route);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const url = new URL(href, "https://arkezinvest.com");
      const file = url.pathname.endsWith("/") ? pagePath(url.pathname) : new URL(`.${url.pathname}`, output);
      assert.ok(existsSync(file), `${href} en ${route}`);
    }
  }
  for (const id of ["mision", "portafolio", "clientes", "noticias", "contacto"]) {
    assert.ok(read("/").includes(`id="${id}"`), id);
  }
  assert.ok(existsSync(new URL("brand/editorial-small.webp", output)));
});

test("la vista previa no incluye formularios ni integraciones de las páginas antiguas", () => {
  const legacy = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const html of [...routes.map(read), legacy]) {
    assert.doesNotMatch(html, /<(?:form|iframe|textarea)\b|formspree\.io|rss2json\.com|raw\.githubusercontent\.com|fonts\.googleapis\.com/i);
    assert.doesNotMatch(html, /<script[^>]*src="https?:\/\//i);
  }
});

test("la exportación incluye 404, sitemap completo y robots para vista previa", () => {
  const file = (path) => readFileSync(new URL(path, output), "utf8");
  assert.match(file("404.html"), /Página no encontrada/);
  assert.match(file("robots.txt"), /Disallow: \//);
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
