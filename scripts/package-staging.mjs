import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { contentPolicy, previewPolicyOptions } from "./pages-headers.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, "out");
const releaseDir = join(root, "releases");
const home = "/prototipos/arkez-integrado/";
const read = (file) => readFileSync(file, "utf8");
const quiz = read(join(source, home, "ruta-de-aprendizaje", "index.html"));
if (!quiz.includes('content="noindex, nofollow"')) throw new Error("Compila primero la vista integrada con el perfil local sin indexación.");

const policies = Object.fromEntries(readdirSync(source, { recursive: true })
  .map((file) => file.split(sep).join("/"))
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const path = "/" + file.replace(/index\.html$/, "");
    return [path, contentPolicy([read(join(source, file))], previewPolicyOptions(path))];
  }));
const inPlace = process.argv.includes("--in-place");
let destination = source;
if (!inPlace) {
  mkdirSync(releaseDir, { recursive: true });
  destination = mkdtempSync(join(releaseDir, "arkez-cloudflare-staging-"));
  cpSync(source, destination, { recursive: true });
}
const news = read(join(root, "scripts", "preview-news.mjs"));
const archive = read(join(root, "scripts", "news-archive.mjs"));
const marketDirectory = JSON.stringify(JSON.parse(read(join(root, "scripts", "market-directory.json"))));
const market = read(join(root, "scripts", "preview-market.mjs")).split("\n").slice(1).join("\n");
const companyStory = read(join(root, "scripts", "preview-company-story.mjs")).split("\n").slice(1).join("\n");
const isa = read(join(root, "scripts", "preview-isa.mjs"));
const worker = read(join(root, "deployment", "arkez-staging-worker.mjs"));
const revision = (process.env.CF_PAGES_COMMIT_SHA ?? "").match(/^[a-f0-9]{7,40}$/i)?.[0] ?? "";
const program = `const stagingRevision = ${JSON.stringify(revision)};\nconst stagingPolicies = ${JSON.stringify(policies)};\n${news}\n${archive}\nconst bundledMarketDirectory = ${marketDirectory};\n${market}\n${companyStory}\n${isa}\n${worker}`;
writeFileSync(join(destination, "_worker.js"), program);
writeFileSync(join(destination, "_headers"), "/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n");
console.log(destination);
