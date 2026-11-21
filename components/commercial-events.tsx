"use client";

import { useEffect } from "react";
import { contactChoices, recordCommercialEvent } from "@/lib/commercial-events";
import { calculatorLink } from "@/lib/navigation";

export function CommercialEvents() {
  useEffect(() => {
    function track(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin !== window.location.origin) return;

      if (target.pathname === "/contacto/") {
        const value = target.searchParams.get("servicio");
        const service = contactChoices.some(([id]) => id === value) ? value : null;
        recordCommercialEvent({ type: "contact_click", service });
      } else if (target.pathname === calculatorLink.href) {
        recordCommercialEvent({ type: "calculator_use", action: "open" });
      } else if (target.pathname.startsWith("/servicios/") || target.pathname === "/para-quien/empresas/") {
        recordCommercialEvent({ type: "service_click", destination: target.pathname });
      }
    }
    document.addEventListener("click", track);
    return () => document.removeEventListener("click", track);
  }, []);
  return null;
}
