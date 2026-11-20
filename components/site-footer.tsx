import { Brand } from "./brand";
import { contactLink, innovationLink, legalLinks, navigation, type SiteLink } from "@/lib/navigation";

const footerGroups = [
  { title: "Explora", links: [...navigation.slice(0, 2), innovationLink] },
  { title: "Arkez Invest", links: [...navigation.slice(2), contactLink] },
  { title: "Información", links: legalLinks },
] satisfies readonly { title: string; links: readonly SiteLink[] }[];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-shell footer-grid">
        <div>
          <Brand inverted />
          <p className="mt-4 max-w-64 text-sm leading-relaxed text-steel">Educación, formación y consultoría financiera para personas y empresas.</p>
        </div>
        <nav aria-label="Enlaces del pie de página" className="footer-navigation">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="font-bold text-white">{group.title}</p>
              <ul className="mt-3 grid gap-2.5 text-sm text-steel">
                {group.links.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container-shell footer-bottom">
        <small>© {process.env.ARKEZ_BUILD_YEAR ?? new Date().getUTCFullYear()} Arkez Invest</small>
        <small>Recursos de carácter educativo.</small>
      </div>
    </footer>
  );
}
