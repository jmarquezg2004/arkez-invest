import { BookOpen, Building2, Compass, FileText, Layers3, MessageCircle, Shield, TrendingUp, Users } from "lucide-react";
import type { ContentCard, IconName } from "@/lib/content";

const icons = {
  book: BookOpen,
  layers: Layers3,
  compass: Compass,
  shield: Shield,
  building: Building2,
  users: Users,
  chart: TrendingUp,
  file: FileText,
  message: MessageCircle,
} satisfies Record<IconName, typeof BookOpen>;

export function FeatureGrid({ cards, variant }: { cards: readonly ContentCard[]; variant?: "services" }) {
  return (
    <ul className="feature-grid" data-variant={variant} data-columns={Math.max(2, Math.min(cards.length, 4))}>
      {cards.map(({ icon, href, label, description }) => {
        const Icon = icons[icon];
        return (
          <li key={href}>
            <article className="feature-card">
              <span className="feature-icon"><Icon size={23} strokeWidth={1.65} aria-hidden="true" /></span>
              <h3><a href={href}>{label}</a></h3>
              <p>{description}</p>
              {variant === "services" && <span className="feature-card-action" aria-hidden="true">Ver servicio</span>}
            </article>
          </li>
        );
      })}
    </ul>
  );
}
