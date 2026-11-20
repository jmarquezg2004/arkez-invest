import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { createPreviewServer } from "../scripts/preview.mjs";

async function preview(t) {
  let clock = 1_000_000;
  const server = createPreviewServer({ now: () => clock });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    return new Promise((done) => server.close(done));
  });

  const base = `http://127.0.0.1:${server.address().port}`;
  const url = `${base}/api/contacto/prueba`;
  return {
    base,
    url,
    advance: (ms) => { clock += ms; },
    issue: async () => (await fetch(url)).json(),
    post: (payload, origin = base) => fetch(url, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  };
}

test("acepta una prueba local válida y rechaza su reutilización", async (t) => {
  const local = await preview(t);
  const { token, waitMs } = await local.issue();
  local.advance(waitMs);
  const response = await local.post({ token, trapFilled: false });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal((await local.post({ token, trapFilled: false })).status, 422);
});

test("rechaza otro origen, campos ajenos y contenido excesivo", async (t) => {
  const local = await preview(t);
  const { token, waitMs } = await local.issue();
  local.advance(waitMs);
  assert.equal((await local.post({ token, trapFilled: false }, "https://ejemplo.invalid")).status, 403);
  assert.equal((await local.post({ token, trapFilled: false, extra: "valor de prueba" })).status, 400);
  assert.equal((await local.post({ token: "a".repeat(500), trapFilled: false })).status, 413);
  assert.equal((await fetch(local.url, { headers: { "Sec-Fetch-Site": "cross-site" } })).status, 403);
});

test("aplica tiempo mínimo, expiración, campo trampa y límite de solicitudes", async (t) => {
  const local = await preview(t);
  const early = await local.issue();
  assert.equal((await local.post({ token: early.token, trapFilled: false })).status, 422);
  const honeypot = await local.issue();
  local.advance(honeypot.waitMs);
  assert.equal((await local.post({ token: honeypot.token, trapFilled: true })).status, 422);
  const expired = await local.issue();
  local.advance(5 * 60_000);
  assert.equal((await local.post({ token: expired.token, trapFilled: false })).status, 422);
  for (let attempt = 0; attempt < 7; attempt++) {
    assert.equal((await local.post({ token: expired.token, trapFilled: false })).status, 422);
  }
  assert.equal((await local.post({ token: expired.token, trapFilled: false })).status, 429);
});

test("la vista previa sirve 404 y cabeceras de seguridad sin permitir indexación", async (t) => {
  const { base } = await preview(t);
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.match(home.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/);
  assert.match(home.headers.get("Content-Security-Policy"), /script-src 'self' 'sha256-/);
  assert.equal((await fetch(`${base}/ruta-que-no-existe/`)).status, 404);
});
