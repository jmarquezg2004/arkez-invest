"use client";

import { useEffect } from "react";

export function ExternalLinks() {
  useEffect(() => {
    function prepare(link: HTMLAnchorElement) {
      if (link.hasAttribute("download")) return;
      const url = URL.parse(link.href);
      if (!url || !["http:", "https:"].includes(url.protocol) || url.origin === window.location.origin) return;
      link.target = "_blank";
      link.relList.add("noopener", "noreferrer");
    }

    function inspect(node: Node) {
      if (node instanceof HTMLAnchorElement && node.hasAttribute("href")) prepare(node);
      if (node instanceof Element) node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(prepare);
    }

    // Update newly rendered results before navigation, including keyboard activation.
    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (link) prepare(link);
    }
    inspect(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") inspect(record.target);
        else record.addedNodes.forEach(inspect);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    document.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
