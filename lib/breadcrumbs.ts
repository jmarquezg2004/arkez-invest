import { pages } from "./content";

export function breadcrumbs(path: string) {
  const segments = path.split("/").filter(Boolean);
  const parents = segments.slice(0, -1).map((_, index) => `/${segments.slice(0, index + 1).join("/")}/`)
    .filter((route) => pages[route]);

  return [
    { href: "/", label: "Inicio" },
    ...parents.map((route) => ({ href: route, label: pages[route].title })),
    { href: path, label: pages[path].title },
  ];
}
