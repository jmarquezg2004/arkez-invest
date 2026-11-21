import { siteName } from "@/lib/navigation";

export function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <a href="/" className={inverted ? "brand brand-inverted" : "brand"}>
      <img src="/brand/logo.webp" width={340} height={123} alt={`${siteName} — Inicio`} />
    </a>
  );
}
