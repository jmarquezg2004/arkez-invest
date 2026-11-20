import { randomBytes } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { commonHeaders, contentPolicy } from "./pages-headers.mjs";

const defaultRoot = fileURLToPath(new URL("../out/", import.meta.url));
const contactPath = "/api/contacto/prueba";
const maxBodyBytes = 256;
const challengeLifetime = 5 * 60 * 1000;
const types = {
  ".css": "text/css", ".html": "text/html", ".ico": "image/x-icon", ".js": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain",
  ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml",
};

function reply(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data));
}

async function contactBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > maxBodyBytes) return null;
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function limiter(max) {
  let windowStart = 0;
  let count = 0;
  return (now) => {
    if (now - windowStart >= 60_000) {
      windowStart = now;
      count = 0;
    }
    return ++count <= max;
  };
}

export function createPreviewServer({ root = defaultRoot, now = Date.now, waitMs = 800 } = {}) {
  const contactChallenges = new Map();
  const allowIssue = limiter(24);
  const allowSubmit = limiter(8);
  const base = resolve(root);
  const server = createServer({ requestTimeout: 8_000, headersTimeout: 5_000, maxHeaderSize: 8_192 }, async (request, response) => {
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    for (const [name, value] of Object.entries(commonHeaders)) response.setHeader(name, value);

    const { port } = server.address();
    const host = request.headers.host;
    if (![ `127.0.0.1:${port}`, `localhost:${port}` ].includes(host) || !request.url?.startsWith("/") || request.url.startsWith("//")) {
      return reply(response, 400, { ok: false });
    }
    const origin = `http://${host}`;

    try {
      const path = decodeURIComponent(new URL(request.url, origin).pathname);
      if (path.startsWith("//") || path.includes("\\") || path.includes("\0")) return reply(response, 400, { ok: false });
      if (path === contactPath) {
        const fetchSite = request.headers["sec-fetch-site"];
        if (fetchSite && fetchSite !== "same-origin") return reply(response, 403, { ok: false });

        if (request.method === "GET") {
          const issuedAt = now();
          if (!allowIssue(issuedAt)) return reply(response, 429, { ok: false });
          for (const [token, created] of contactChallenges) {
            if (issuedAt - created >= challengeLifetime) contactChallenges.delete(token);
          }
          const token = randomBytes(24).toString("base64url");
          contactChallenges.set(token, issuedAt);
          return reply(response, 200, { token, waitMs });
        }

        if (request.method !== "POST") return reply(response, 405, { ok: false });
        if (request.headers.origin !== origin) return reply(response, 403, { ok: false });
        const submittedAt = now();
        if (!allowSubmit(submittedAt)) return reply(response, 429, { ok: false });
        if (request.headers["content-type"] !== "application/json") return reply(response, 415, { ok: false });
        if (Number(request.headers["content-length"]) > maxBodyBytes) return reply(response, 413, { ok: false });
        const body = await contactBody(request).catch(() => undefined);
        if (body === null) {
          response.setHeader("Connection", "close");
          return reply(response, 413, { ok: false });
        }
        if (!body || Object.keys(body).length !== 2 || typeof body.trapFilled !== "boolean"
          || typeof body.token !== "string" || !/^[A-Za-z0-9_-]{32}$/.test(body.token)) {
          return reply(response, 400, { ok: false });
        }

        const created = contactChallenges.get(body.token);
        contactChallenges.delete(body.token);
        if (created === undefined || body.trapFilled
          || submittedAt - created < waitMs || submittedAt - created >= challengeLifetime) {
          return reply(response, 422, { ok: false });
        }
        return reply(response, 200, { ok: true });
      }

      if (request.method !== "GET" && request.method !== "HEAD") return reply(response, 405, { ok: false });
      let file = resolve(base, `.${path}`);
      const inside = relative(base, file);
      if (inside === ".." || inside.startsWith(`..${sep}`) || inside.split(sep).some((segment) => segment.startsWith("."))) {
        return reply(response, 404, { ok: false });
      }

      let status = 200;
      let content;
      try {
        if ((await stat(file)).isDirectory()) {
          if (!path.endsWith("/")) {
            response.writeHead(308, { Location: `${encodeURI(path)}/${new URL(request.url, origin).search}` });
            return response.end();
          }
          file = resolve(file, "index.html");
        }
        if (!types[extname(file)]) throw new Error("Unsupported file");
        content = await readFile(file);
      } catch {
        status = 404;
        file = resolve(base, "404.html");
        content = await readFile(file);
      }

      const type = types[extname(file)];
      if (type === "text/html") response.setHeader("Content-Security-Policy", contentPolicy([content.toString("utf8")]));
      response.writeHead(status, { "Content-Type": type.startsWith("text/") ? `${type}; charset=utf-8` : type, "Content-Length": content.length });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch {
      reply(response, 400, { ok: false });
    }
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.ARKEZ_PREVIEW_PORT ?? 4173);
  const preview = createPreviewServer();
  preview.on("error", (error) => {
    console.error(`No se pudo iniciar la vista previa: ${error.message}`);
    process.exitCode = 1;
  });
  preview.listen(port, "127.0.0.1", () => {
    console.log(`Vista previa local: http://127.0.0.1:${preview.address().port}/`);
  });
}
