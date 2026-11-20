import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} terminó con código ${result.status}.`);
  return result.stdout?.trim();
}

const [profile = "preview", ...extra] = process.argv.slice(2);
if (!["production", "preview"].includes(profile) || extra.length) throw new Error("Usa el perfil preview o production.");
if (run("git", ["status", "--porcelain"])) throw new Error("Crea la versión desde un checkout limpio.");
const nodeVersion = readFileSync(".node-version", "utf8").trim();
if (process.versions.node !== nodeVersion) throw new Error(`La versión fijada de Node es ${nodeVersion}.`);

const revision = run("git", ["rev-parse", "HEAD"]);
const sourceDate = Number(run("git", ["log", "-1", "--format=%ct"]));
const env = {
  ...process.env,
  ARKEZ_INDEXABLE: profile === "production" ? "1" : "0",
  ARKEZ_BUILD_ID: revision,
  ARKEZ_BUILD_YEAR: String(new Date(sourceDate * 1000).getUTCFullYear()),
  NEXT_TELEMETRY_DISABLED: "1",
  SOURCE_DATE_EPOCH: String(sourceDate),
};
const options = { env, stdio: "inherit" };
run("npm", ["ci", "--no-audit", "--no-fund"], options);
run("npm", ["audit", "--audit-level=low"], options);
run("npm", ["run", "build"], options);
run("npm", ["run", "typecheck"], options);
run("npm", ["test"], options);

mkdirSync("releases", { recursive: true });
const name = `arkez-${profile}-${revision.slice(0, 12)}.tar.gz`;
const output = `releases/${name}`;
const uncompressed = `${output}.tmp`;
try {
  run("tar", [
    "--sort=name", "--format=gnu", `--mtime=@${sourceDate}`, "--owner=0", "--group=0",
    "--numeric-owner", "--mode=u+rwX,go+rX,go-w", "-cf", uncompressed, "-C", "out", ".",
  ], options);
  const bytes = gzipSync(readFileSync(uncompressed), { level: 9 });
  writeFileSync(output, bytes);
  const integrity = createHash("sha256").update(bytes).digest("hex");
  writeFileSync(`${output}.sha256`, `${integrity}  ${name}\n`);
  console.log(`Artefacto local: ${output} (SHA-256 ${integrity})`);
} finally {
  rmSync(uncompressed, { force: true });
}
