export const prototypeDirections = {
  editorial: { name: "Editorial Premium", letter: "A" },
  interactiva: { name: "Interactive Finance", letter: "B" },
} as const;

export type PrototypeDirection = keyof typeof prototypeDirections;
export type PrototypeView = "portada" | "innovacion";

export function prototypePath(direction: PrototypeDirection, view: PrototypeView = "portada") {
  return `/prototipos/${direction}/${view === "innovacion" ? "innovacion/" : ""}`;
}

export const prototypePaths = (Object.keys(prototypeDirections) as PrototypeDirection[])
  .flatMap((direction) => [prototypePath(direction), prototypePath(direction, "innovacion")]);

export function matchPrototype(path: string) {
  if (process.env.ARKEZ_INDEXABLE === "1" || !prototypePaths.includes(path)) return null;
  const [, , direction, view] = path.split("/");
  return { direction: direction as PrototypeDirection, view: view === "innovacion" ? "innovacion" : "portada" } as const;
}
