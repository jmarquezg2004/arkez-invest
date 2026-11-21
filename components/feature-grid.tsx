import { EducationMark, BusinessMark, CounselMark, DocumentMark, AllocationMark, DialogueMark, RiskMark, MarketMark, PeopleMark } from "@/components/arkez-icons";
import type { ContentCard, IconName } from "@/lib/content";

const icons = {
  book: EducationMark,
  layers: AllocationMark,
  compass: CounselMark,
  shield: RiskMark,
  building: BusinessMark,
  users: PeopleMark,
  chart: MarketMark,
  file: DocumentMark,
  message: DialogueMark,
} satisfies Record<IconName, typeof EducationMark>;

export function FeatureGrid({ cards }: { cards: readonly ContentCard[] }) {
  return (
    <ul className="feature-grid" data-columns={Math.max(2, Math.min(cards.length, 4))}>
      {cards.map(({ icon, href, label, description }) => {
        const Icon = icons[icon];
        return (
          <li key={href}>
            <article className="feature-card">
              <span className="feature-icon"><Icon size={23} strokeWidth={1.65} aria-hidden="true" /></span>
              <h3><a href={href}>{label}</a></h3>
              <p>{description}</p>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
