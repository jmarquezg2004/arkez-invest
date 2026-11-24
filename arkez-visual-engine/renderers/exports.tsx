"use client";

import { Download, Printer } from "lucide-react";

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExportActions({ slug }: { slug: string }) {
  function html() {
    const article = document.getElementById("ve-resource-body");
    if (!article) return;
    const copy = article.cloneNode(true) as HTMLElement;
    copy.querySelectorAll("button,svg,img,nav,section[aria-label='Exportar']").forEach((element) => element.remove());
    const stylesheet = "body{max-width:70ch;margin:3rem auto;padding:0 1rem;color:#0d1e35;font:16px system-ui}h1,h2{line-height:1.15}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbc4ce;padding:.5rem;text-align:left}li{margin-bottom:.45rem}details{display:block}";
    // The article contains application-generated text and links only. The detached copy is exported without scripts or controls.
    copy.querySelectorAll("details").forEach((element) => element.open = true);
    download(new Blob([`<!doctype html><html lang="es"><meta charset="utf-8"><title>Arkez Research</title><style>${stylesheet}</style><body>${copy.outerHTML}</body></html>`], { type: "text/html" }), `arkez-${slug}.html`);
  }
  return <section className="ve-export" aria-label="Exportar"><button type="button" onClick={() => window.print()}><Printer size={17} /> Imprimir / PDF</button><button type="button" onClick={html}><Download size={17} /> Descargar HTML</button></section>;
}
