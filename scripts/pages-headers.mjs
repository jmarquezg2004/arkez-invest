import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, resolve, sep } from "node:path";

export const commonHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function contentPolicy(documents) {
  const hashes = new Set();
  for (const html of documents) {
    for (const [, script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      if (script) hashes.add(`'sha256-${createHash("sha256").update(script).digest("base64")}'`);
    }
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].sort().join(" ")}`.trim(),
    "script-src-attr 'none'",
    "style-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join("; ");
}

export function writePagesHeaders(directory, indexable) {
  const htmlFiles = readdirSync(directory, { recursive: true })
    .map((file) => file.split(sep).join("/")).filter((file) => file.endsWith(".html")).sort();
  const read = (file) => readFileSync(join(directory, file), "utf8");
  const fallback = contentPolicy(htmlFiles.filter((file) => /^(404|_not-found)(\/|\.html)/.test(file)).map(read));
  const rules = [
    ["/*", ...Object.entries(commonHeaders).map(([key, value]) => `${key}: ${value}`), `Content-Security-Policy: ${fallback}`],
    ["/_next/static/*", "Cache-Control: public, max-age=31536000, immutable"],
  ];
  if (indexable) {
    rules.push(
      ["https://arkezinvest.com/*", "Strict-Transport-Security: max-age=31536000"],
      ["https://:project.pages.dev/*", "X-Robots-Tag: noindex, nofollow"],
      ["https://:preview.:project.pages.dev/*", "X-Robots-Tag: noindex, nofollow"],
    );
  } else {
    rules[0].push("X-Robots-Tag: noindex, nofollow");
  }

  for (const file of htmlFiles) {
    // Pages redirects explicit index.html requests before serving the extensionless document.
    const paths = file === "index.html" ? ["/"]
      : file.endsWith("/index.html") ? [`/${file.slice(0, -10)}`, `/${file.slice(0, -11)}`]
      : [`/${file}`];
    const policy = contentPolicy([read(file)]);
    for (const path of paths) rules.push([path, "! Content-Security-Policy", `Content-Security-Policy: ${policy}`]);
  }

  const sections = rules.map(([path, ...headers]) => [path, ...headers.map((header) => `  ${header}`)].join("\n"));
  if (rules.length > 100 || sections.some((section) => section.split("\n").some((line) => line.length > 2000))) {
    throw new Error("La configuración supera los límites de _headers de Cloudflare Pages.");
  }
  writeFileSync(join(directory, "_headers"), sections.join("\n\n") + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  writePagesHeaders(fileURLToPath(new URL("../out/", import.meta.url)), process.env.ARKEZ_INDEXABLE === "1");
}
