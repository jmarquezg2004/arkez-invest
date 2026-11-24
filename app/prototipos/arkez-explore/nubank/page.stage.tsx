import { Shell } from "@/arkez-visual-engine/components/shell";
import { ResearchIndex } from "@/arkez-visual-engine/templates/research";
import { nubank } from "@/arkez-visual-engine/research-data";
export default function Page() { return <Shell section="research"><ResearchIndex data={nubank} /></Shell>; }
