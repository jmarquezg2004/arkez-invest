import assert from "node:assert/strict";
import { once } from "node:events";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createPreviewServer } from "../scripts/preview.mjs";

const output = new URL("../out/", import.meta.url);
const read = (path) => readFileSync(new URL(path, output), "utf8");

test("los enlaces Leer, Ver PDF y Descargar tienen destinos reales", async (t) => {
  const library = read("recursos/index.html");
  const downloads = [...library.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*\bdownload=""/g)].map(([, href]) => href);
  const reads = [...library.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*aria-label="Leer:/g)].map(([, href]) => href);
  const pdfViews = [...library.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*aria-label="Ver PDF:/g)].map(([, href]) => href);
  assert.equal(new Set(downloads).size, 4);
  assert.equal(new Set(reads).size, 6);
  assert.deepEqual(pdfViews.sort(), downloads.filter((href) => href.endsWith(".pdf")).sort());

  const schema = JSON.parse(library.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"]
    .find((item) => item["@type"] === "ItemList").itemListElement;
  assert.equal(schema.length, reads.length);
  assert.equal(schema.filter(({ item }) => item.encoding).length, downloads.length);

  const server = createPreviewServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    return new Promise((done) => server.close(done));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const href of [...reads, ...downloads]) {
    const response = await fetch(base + href);
    assert.equal(response.status, 200, href);
    const data = Buffer.from(await response.arrayBuffer());
    if (href.endsWith(".pdf")) {
      assert.match(response.headers.get("Content-Type"), /^application\/pdf/);
      assert.ok(data.toString("ascii", 0, 8).startsWith("%PDF-"));
      assert.match(data.toString("ascii").trimEnd(), /%%EOF$/);
    } else if (href.endsWith(".csv")) {
      assert.match(response.headers.get("Content-Type"), /^text\/csv/);
      assert.match(data.toString("utf8"), /Mes 1,900,350,1500,-250/);
      assert.match(data.toString("utf8"), /Mi escenario base,,,,,,,/);
    } else {
      const { hash } = new URL(href, base);
      if (hash) assert.ok(data.toString("utf8").includes(`id="${hash.slice(1)}"`), href);
    }
  }
});
