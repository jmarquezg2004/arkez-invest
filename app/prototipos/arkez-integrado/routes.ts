import { pages } from "@/lib/content";
import { resourceTypes } from "@/arkez-visual-engine/schemas/research";

export const base = "/prototipos/arkez-integrado";
export const aiChainPath = base + "/explore/ecosistema-ia/";
export const aiMapPath = aiChainPath + "#empresas-cadena-ia";
export const aiMapDownload = base + "/archivos/mapa-relaciones-ia.zip";
export const visualStoriesRoute = "/research/visual-stories/";
export const visualStoriesPath = base + visualStoriesRoute;
export const oddityStoryRoute = "/research/oddity/historia/";
export const oddityStoryPath = base + oddityStoryRoute;
export const learningPathRoute = "/ruta-de-aprendizaje/";
export const publicRoutes = [...new Set([...Object.keys(pages), "/innovacion/"])].filter((path) => path !== "/").sort();
export const researchRoutes = [
  "/explore/", "/explore/oddity/", "/visual-stories/", "/research/", visualStoriesRoute, oddityStoryRoute, "/explore/ecosistema-ia/",
  "/explore/nubank/", ...resourceTypes.map(({ id }) => `/explore/nubank/${id}/`),
  "/research/oddity/", "/research/oddity/informe/", "/research/oddity/modelo/",
];

const publicPaths = new Set(["/", ...publicRoutes]);
const exploreBase = "/prototipos/arkez-explore";

export function previewHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut < 0 ? href : href.slice(0, cut);
  const suffix = cut < 0 ? "" : href.slice(cut);
  if (path === "/prototipos/arkez-nexacore/") return base + "/" + suffix;
  if (path.startsWith(exploreBase + "/")) return base + "/explore" + path.slice(exploreBase.length) + suffix;
  return publicPaths.has(path) ? base + path + suffix : href;
}
