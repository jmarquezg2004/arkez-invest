import { Brand } from "./brand";
import { contactLink, legalLinks, navigation, type SiteLink } from "@/lib/navigation";

const footerGroups = [
  { title: "Explora", links: navigation.slice(0, 2) },
  { title: "Arkez Invest", links: [...navigation.slice(2), contactLink] },
  { title: "Información", links: legalLinks },
] satisfies readonly { title: string; links: readonly SiteLink[] }[];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-shell footer-grid">
        <div>
          <Brand inverted />
          <p className="mt-4 max-w-64 text-sm leading-relaxed text-steel">Educación financiera para entender tus decisiones.</p>
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
        <small>© {new Date().getUTCFullYear()} Arkez Invest</small>
        <small>Contenido de carácter educativo.</small>
      </div>
    </footer>
  );
}
