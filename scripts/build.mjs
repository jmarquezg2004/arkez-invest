import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const deploymentHost = URL.parse(process.env.CF_PAGES_URL ?? "")?.hostname ?? "";
const stage = process.env.CF_PAGES === "1"
  && /^(?:[a-z0-9-]+\.)?arkez-invest-staging\.pages\.dev$/.test(deploymentHost);
const env = stage ? { ...process.env, ARKEZ_INDEXABLE: "0", ARKEZ_LOCAL_PREVIEW: "1" } : process.env;

function run(file, ...args) {
  const result = spawnSync(process.execPath, [file, ...args], { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(require.resolve("next/dist/bin/next"), "build");
if (env.ARKEZ_LOCAL_PREVIEW === "1" && env.ARKEZ_INDEXABLE !== "1") {
  const assets = new URL("../out/prototipos/arkez-integrado/archivos/", import.meta.url);
  mkdirSync(assets, { recursive: true });
  copyFileSync(new URL("../resources/prototipos/mapa-relaciones-ia.zip", import.meta.url), new URL("mapa-relaciones-ia.zip", assets));
}
run(fileURLToPath(new URL(stage ? "./package-staging.mjs" : "./pages-headers.mjs", import.meta.url)), ...(stage ? ["--in-place"] : []));
