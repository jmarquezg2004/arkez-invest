import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrototypePage } from "@/components/prototypes/prototype-page";
import { matchPrototype, prototypeDirections, prototypePaths } from "@/lib/prototype-routes";

type RouteProps = { params: Promise<{ propuesta: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return prototypePaths.map((path) => ({ propuesta: path.split("/").filter(Boolean).slice(1) }));
}

async function getPrototype(params: RouteProps["params"]) {
  const { propuesta } = await params;
  const prototype = matchPrototype(`/prototipos/${propuesta.join("/")}/`);
  if (!prototype) notFound();
  return prototype;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { direction, view } = await getPrototype(params);
  const pageName = view === "innovacion" ? "Innovation Hub" : "Portada";
  return {
    title: `${pageName} · ${prototypeDirections[direction].name}`,
    description: "Prototipo navegable de Arkez Invest para revisión de diseño.",
    robots: { index: false, follow: false },
  };
}

export default async function PrototypeRoute({ params }: RouteProps) {
  return <PrototypePage {...await getPrototype(params)} />;
}
