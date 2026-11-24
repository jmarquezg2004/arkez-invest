import { notFound } from "next/navigation";
import { Shell } from "@/arkez-visual-engine/components/shell";
import { ResearchResource } from "@/arkez-visual-engine/templates/research";
import { nubank } from "@/arkez-visual-engine/research-data";
import { resourceTypes } from "@/arkez-visual-engine/schemas/research";

export function generateStaticParams() { return resourceTypes.map(({ id }) => ({ recurso: id })); }
export default async function Page({ params }: { params: Promise<{ recurso: string }> }) {
  const { recurso } = await params;
  const type = resourceTypes.find(({ id }) => id === recurso);
  if (!type) notFound();
  return <Shell section="research"><ResearchResource data={nubank} id={type.id} /></Shell>;
}
