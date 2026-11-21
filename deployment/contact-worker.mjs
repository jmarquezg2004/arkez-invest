const contactPath = "/api/contacto";
const encoded = new TextEncoder();
const maxBody = 8192;
const services = new Set(["educacion-financiera", "analisis-de-mercados", "formacion-practica", "consultoria-financiera", "finanzas-empresariales"]);

function respond(status, code) {
  return Response.json({ ok: status === 202, code }, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
      "Strict-Transport-Security": "max-age=31536000",
      ...(status === 429 ? { "Retry-After": "60" } : {}),
    },
  });
}

class SizeError extends Error {}

async function readJson(request) {
  const reader = request.body?.getReader();
  const decoder = new TextDecoder("utf8", { fatal: true });
  let text = "";
  let size = 0;
  try {
    if (!reader) throw new Error("Missing body");
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return JSON.parse(text + decoder.decode());
      size += value.byteLength;
      if (size > maxBody) {
        await reader.cancel();
        throw new SizeError();
      }
      text += decoder.decode(value, { stream: true });
    }
  } finally {
    reader?.releaseLock();
  }
}

function validate(input) {
  if (!input || Array.isArray(input) || typeof input !== "object") return;
  const fields = ["name", "email", "service", "message", "privacyAccepted", "website", "captcha"];
  if (Object.keys(input).length !== fields.length || !fields.every((field) => Object.hasOwn(input, field))) return;
  const { name, email, service, message, privacyAccepted, website, captcha } = input;
  const matches = (value, regex) => typeof value === "string" && regex.test(value.trim());
  if (privacyAccepted !== true || website !== "" || !services.has(service)
    || typeof name !== "string" || /[\x00-\x1f\x7f]/u.test(name) || !matches(name, /^.{2,100}$/u)
    || typeof email !== "string" || email.length > 254 || /[\x00-\x20\x7f]/u.test(email) || !matches(email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/u)
    || !matches(message, /^[^\x00-\x08\x0b\x0c\x0e-\x1f\x7f]{10,1200}$/u)
    || !matches(captcha, /^[!-~]{1,2048}$/)) return;
  return { name: name.trim(), email, service, message: message.trim(), captcha: captcha.trim() };
}

async function rateKey(ip, secret) {
  const key = await crypto.subtle.importKey("raw", encoded.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoded.encode(ip));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createContactHandler(fetcher = fetch) {
  return async function contact(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== contactPath) return respond(404, "not_found");
    if (request.method !== "POST") return respond(405, "method");
    if (env.CONTACT_DELIVERY_MODE !== "live" || !env.CONTACT_RATE_LIMIT?.limit
      || !env.TURNSTILE_SECRET || !env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO
      || typeof env.CONTACT_RATE_SECRET !== "string" || env.CONTACT_RATE_SECRET.length < 32
      || typeof env.CONTACT_SITE_ORIGIN !== "string" || !env.CONTACT_SITE_ORIGIN.startsWith("https://")) return respond(503, "disabled");
    if (url.origin !== env.CONTACT_SITE_ORIGIN || request.headers.get("Origin") !== env.CONTACT_SITE_ORIGIN
      || (request.headers.has("Sec-Fetch-Site") && request.headers.get("Sec-Fetch-Site") !== "same-origin")) {
      return respond(403, "origin");
    }
    if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") return respond(415, "content_type");
    if (Number(request.headers.get("Content-Length")) > maxBody) return respond(413, "size");
    const ip = request.headers.get("CF-Connecting-IP");
    if (!ip) return respond(503, "unavailable");

    try {
      if (!(await env.CONTACT_RATE_LIMIT.limit({ key: await rateKey(ip, env.CONTACT_RATE_SECRET) })).success) {
        return respond(429, "rate_limit");
      }
      let fields;
      try {
        fields = validate(await readJson(request));
      } catch (error) {
        return error instanceof SizeError ? respond(413, "size") : respond(400, "invalid");
      }
      if (!fields) return respond(400, "invalid");

      const verification = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: fields.captcha }),
      });
      if (!verification.ok) return respond(503, "unavailable");
      const result = await verification.json();
      if (result.success !== true || result.hostname !== url.hostname || result.action !== "contacto") {
        return respond(403, "antispam");
      }

      const delivered = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: [env.CONTACT_TO],
          subject: "Consulta web de Arkez Invest",
          text: `Nombre: ${fields.name}\nCorreo: ${fields.email}\nServicio: ${fields.service}\n\n${fields.message}`,
        }),
      });
      return delivered.ok ? respond(202, "accepted") : respond(503, "unavailable");
    } catch {
      return respond(503, "unavailable");
    }
  };
}

export default { fetch: createContactHandler() };
