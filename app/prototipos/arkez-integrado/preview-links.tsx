"use client";

import { useEffect, useRef } from "react";
import { previewHref } from "./routes";

export function PreviewLinks({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = content.current;
    if (!root) return;
    function update(link: HTMLAnchorElement) {
      const original = link.getAttribute("href");
      if (!original || link.hasAttribute("download")) return;
      const href = previewHref(original);
      if (href !== original) link.setAttribute("href", href);
    }
    function read(node: Node) {
      if (node instanceof HTMLAnchorElement) update(node);
      if (node instanceof Element) node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(update);
    }
    read(root);
    const observer = new MutationObserver((mutations) => {
      for (const record of mutations) {
        if (record.type === "attributes") read(record.target);
        else record.addedNodes.forEach(read);
      }
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    return () => observer.disconnect();
  }, []);
  return <div className="ai-preview-content" ref={content}>{children}</div>;
}
