"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { contactLink, navigation, type SiteLink } from "@/lib/navigation";

function MenuLink({ link, pathname }: { link: SiteLink; pathname: string }) {
  return (
    <a href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
      {link.label}
    </a>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((menu) => {
          menu.open = false;
        });
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      const focused = document.activeElement;
      const open = Array.from(header.current?.querySelectorAll<HTMLDetailsElement>("details[open]") ?? []);
      const menu = open.reverse().find((item) => focused && item.contains(focused))
        ?? open.find((item) => item.offsetWidth > 0);

      if (menu) {
        event.preventDefault();
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header ref={header} className="site-header">
      <div className="container-shell header-inner">
        <Brand />
        <nav aria-label="Navegación principal" className="desktop-nav">
          <a className="nav-link" href="/" aria-current={pathname === "/" ? "page" : undefined}>Inicio</a>
          {navigation.map((group) => (
            <details className="nav-group" name="desktop-navigation" key={group.href}>
              <summary className="nav-link" data-current={pathname.startsWith(group.href)}>
                {group.label}<ChevronDown size={14} aria-hidden="true" />
              </summary>
              <ul className="nav-dropdown">
                <li><MenuLink link={{ ...group, label: `Ver ${group.label.toLowerCase()}` }} pathname={pathname} /></li>
                {group.children.map((link) => <li key={link.href}><MenuLink link={link} pathname={pathname} /></li>)}
              </ul>
            </details>
          ))}
        </nav>
        <a className="button button-header desktop-contact" href={contactLink.href} aria-current={pathname === contactLink.href ? "page" : undefined}>
          {contactLink.label}
        </a>
        <details className="mobile-menu">
          <summary className="mobile-toggle">
            <Menu size={23} className="menu-icon" aria-hidden="true" />
            <X size={23} className="close-icon" aria-hidden="true" />
            <span>Menú</span>
          </summary>
          <nav aria-label="Navegación móvil" className="mobile-panel">
            <MenuLink link={{ label: "Inicio", href: "/" }} pathname={pathname} />
            {navigation.map((group) => (
              <details className="mobile-group" name="mobile-navigation" key={group.href}>
                <summary>{group.label}<ChevronDown size={16} aria-hidden="true" /></summary>
                <ul>
                  <li><MenuLink link={{ ...group, label: `Ver ${group.label.toLowerCase()}` }} pathname={pathname} /></li>
                  {group.children.map((link) => <li key={link.href}><MenuLink link={link} pathname={pathname} /></li>)}
                </ul>
              </details>
            ))}
            <MenuLink link={contactLink} pathname={pathname} />
          </nav>
        </details>
      </div>
    </header>
  );
}
