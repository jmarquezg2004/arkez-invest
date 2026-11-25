import { siteName } from "@/lib/navigation";

export function Brand({ inverted = false, href = "/" }: { inverted?: boolean; href?: string }) {
  return (
    <a href={href} className={inverted ? "brand brand-inverted" : "brand"}>
      <img src="/brand/logo.webp" width={340} height={123} alt={`${siteName} — Inicio`} />
    </a>
  );
}
