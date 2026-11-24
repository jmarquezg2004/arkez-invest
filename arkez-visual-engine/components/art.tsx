import type { Art } from "../catalog";
import chip from "../assets/chip.webp";
import bank from "../assets/bank.webp";
import security from "../assets/security.webp";
import energy from "../assets/energy.webp";
import report from "../assets/report.webp";
import globe from "../assets/globe.webp";
import study from "../assets/study.webp";
import chain from "../assets/chain.webp";

const images = { chip, bank, security, energy, report, globe, study, chain };

export function ArtImage({ art, eager = false }: { art: Art; eager?: boolean }) {
  const image = images[art];
  return <img src={image.src} width={image.width} height={image.height} alt="" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />;
}
