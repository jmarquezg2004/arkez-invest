import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createContactHandler } from "../deployment/contact-worker.mjs";

const origin = "https://arkezinvest.com";
const payload = {
  name: "Persona de prueba", email: "prueba@example.com", service: "consultoria-financiera",
  message: "Consulta ficticia para verificar el adaptador.", privacyAccepted: true, website: "", captcha: "prueba.ficticia",
};

function request(body = payload, requestOrigin = origin) {
  return new Request(`${origin}/api/contacto`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: requestOrigin, "CF-Connecting-IP": "192.0.2.100" },
    body: JSON.stringify(body),
  });
}

function fixture() {
  return {
    CONTACT_DELIVERY_MODE: "live", CONTACT_SITE_ORIGIN: origin, CONTACT_FROM: "origen@example.com", CONTACT_TO: "destino@example.com",
    CONTACT_RATE_SECRET: "valor reproducible de prueba local", TURNSTILE_SECRET: "ficticio", RESEND_API_KEY: "ficticio",
    CONTACT_RATE_LIMIT: { limit: async ({ key }) => ({ success: /^[a-f0-9]{64}$/.test(key) }) },
  };
}

test("publicación estática aplica cabeceras, hashes de cada documento y perfil de indexación", () => {
  const indexable = process.env.ARKEZ_INDEXABLE === "1";
  const read = (file) => readFileSync(new URL(`../out/${file}`, import.meta.url), "utf8");
  const sections = read("_headers").trim().split("\n\n");
  const shared = sections[0];
  assert.ok(sections.length <= 100 && sections.every((section) => section.split("\n").every((line) => line.length <= 2000)));
  for (const name of ["X-Frame-Options: DENY", "X-Content-Type-Options: nosniff", "Referrer-Policy:", "frame-ancestors 'none'"]) {
    assert.ok(shared.includes(name), name);
  }
  assert.equal(shared.includes("X-Robots-Tag"), !indexable);
  if (indexable) {
    assert.ok(sections.some((rule) => rule.startsWith(`${origin}/*\n`) && rule.includes("Strict-Transport-Security: max-age=31536000")));
    assert.equal(sections.filter((rule) => rule.includes(".pages.dev/*") && rule.includes("X-Robots-Tag")).length, 2);
  }
  const routes = [...read("sitemap.xml").matchAll(/<loc>https:\/\/arkezinvest.com([^<]*)<\/loc>/g)].map(([, path]) => path);
  for (const path of routes) {
    const rule = sections.find((section) => section.startsWith(`${path}\n`));
    assert.ok(rule?.includes("! Content-Security-Policy"), path);
    assert.doesNotMatch(rule, /unsafe-inline|unsafe-eval/);
    for (const [, script] of read(`${path.slice(1)}index.html`).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (script) assert.ok(rule.includes(`sha256-${createHash("sha256").update(script).digest("base64")}`), path);
    }
  }
});

test("captación permanece desactivada o falla cerrada sin dependencias", async () => {
  let calls = 0;
  const handler = createContactHandler(async () => { calls++; });
  for (const env of [{}, { ...fixture(), CONTACT_DELIVERY_MODE: "disabled" }, { ...fixture(), CONTACT_RATE_LIMIT: undefined }]) {
    assert.equal((await handler(request(), env)).status, 503);
  }
  assert.equal(calls, 0);
});

test("rechaza origen, datos inválidos, trampa, exceso y un límite agotado", async () => {
  let calls = 0;
  const handler = createContactHandler(async () => { calls++; });
  const env = fixture();
  assert.equal((await handler(request(payload, "https://example.invalid"), env)).status, 403);
  assert.equal((await handler(request({ ...payload, privacyAccepted: false }), env)).status, 400);
  assert.equal((await handler(request({ ...payload, website: "ficticio" }), env)).status, 400);
  assert.equal((await handler(request({ ...payload, message: "a".repeat(8300) }), env)).status, 413);
  const limited = await handler(request(), { ...env, CONTACT_RATE_LIMIT: { limit: async () => ({ success: false }) } });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "60");
  assert.equal(calls, 0);
});

test("envía sólo con desafío válido y mantiene las respuestas sin datos personales", async () => {
  const calls = [];
  const handler = createContactHandler(async (url, init) => {
    calls.push([url, init]);
    return calls.length === 1 ? Response.json({ success: true, hostname: "arkezinvest.com", action: "contacto" }) : Response.json({});
  });
  const response = await handler(request(), fixture());
  assert.equal(response.status, 202);
  assert.equal(calls.length, 2);
  assert.equal(calls[0][0], "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(calls[0][1].body.has("remoteip"), false);
  assert.equal(calls[1][0], "https://api.resend.com/emails");
  const sent = JSON.parse(calls[1][1].body);
  assert.deepEqual(sent.to, ["destino@example.com"]);
  assert.ok(sent.text.includes(payload.email) && !sent.html);
  assert.doesNotMatch(JSON.stringify(await response.json()), /example\.com/);
});

test("desafío ajeno o caída del proveedor impiden informar éxito", async () => {
  let calls = 0;
  const wrong = createContactHandler(async () => {
    calls++;
    return Response.json({ success: true, hostname: "elsewhere.invalid", action: "contacto" });
  });
  assert.equal((await wrong(request(), fixture())).status, 403);
  assert.equal(calls, 1);
  const outage = createContactHandler(async (url) => url.includes("siteverify")
    ? Response.json({ success: true, hostname: "arkezinvest.com", action: "contacto" })
    : new Response(null, { status: 500 }));
  assert.equal((await outage(request(), fixture())).status, 503);
});
