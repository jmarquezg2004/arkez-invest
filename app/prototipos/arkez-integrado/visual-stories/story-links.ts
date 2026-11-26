import { oddityStoryPath, visualStoriesPath } from "../routes";

const readingStories: Readonly<Record<string, string>> = {
  "/recursos/guias/#liquidez-operativa": "caja",
  "/recursos/guias/#comparar-escenarios": "escenarios",
  "/recursos/guias/#revisar-fuentes": "fuentes",
  "/recursos/guias/primeros-pasos/": "plazos",
  "/recursos/articulos/#inflacion": "inflacion",
  "/recursos/articulos/#lectura-de-mercados": "fuentes",
  "/recursos/articulos/que-es-diversificar/": "diversificacion",
};

export function storyForReading(path: string) {
  if (path.startsWith("/research/oddity/")) return oddityStoryPath;
  const story = readingStories[path];
  return story ? visualStoriesPath + "#historia-" + story : undefined;
}
