"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Locale = "es" | "en";
type Translator = { translate(value: string): Promise<string>; destroy(): void };
type TranslatorAPI = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: { sourceLanguage: string; targetLanguage: string; signal: AbortSignal }): Promise<Translator>;
};

const key = "arkez-language";
const Language = createContext<{ locale: Locale; setLocale(locale: Locale): void }>({ locale: "es", setLocale() {} });
export const useLanguage = () => useContext(Language);

function initialLanguage(): Locale {
  try {
    const saved = localStorage.getItem(key);
    if (saved === "es" || saved === "en") return saved;
  } catch {}
  for (const value of navigator.languages ?? [navigator.language]) {
    const language = value.toLowerCase().split("-")[0];
    if (language === "en" || language === "es") return language;
  }
  return "es";
}

const attributes = ["aria-label", "placeholder", "alt", "title"] as const;
const skip = "script,style,svg,code,[translate='no'],[data-arkez-localized]";
const params = { sourceLanguage: "es", targetLanguage: "en" };

export function PreviewLanguage({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("es");
  const [mode, setMode] = useState<"loading" | "partial" | "local">("loading");
  const root = useRef<HTMLDivElement>(null);
  const automatic = useRef<Translator | null>(null);
  const controller = useRef<AbortController | null>(null);
  const [modelVersion, refresh] = useState(0);

  function loadTranslator(requestDownload: boolean) {
    const api = (window as Window & { Translator?: TranslatorAPI }).Translator;
    if (!api) { setMode("partial"); return; }
    if (automatic.current) { setMode("local"); return; }
    controller.current?.abort();
    const task = new AbortController();
    controller.current = task;
    void (async () => {
      try {
        const available = await api.availability(params);
        // Native APIs require a language-picker interaction to start a download.
        if (available !== "available" && !(requestDownload && ["downloadable", "downloading"].includes(available))) {
          if (!task.signal.aborted) setMode("partial");
          return;
        }
        if (task.signal.aborted) return;
        const translator = await api.create({ ...params, signal: task.signal });
        if (task.signal.aborted) { translator.destroy(); return; }
        automatic.current = translator;
        setMode("local");
        refresh((v) => v + 1);
      } catch {
        if (!task.signal.aborted) setMode("partial");
      }
    })();
  }

  useEffect(() => {
    const detected = initialLanguage();
    updateLocale(detected);
    if (detected === "en") loadTranslator(false);
    return () => {
      controller.current?.abort();
      automatic.current?.destroy();
      automatic.current = null;
    };
  }, []);

  function setLocale(next: Locale) {
    try { localStorage.setItem(key, next); } catch {}
    updateLocale(next);
    if (next === "en") loadTranslator(true);
    else controller.current?.abort();
  }

  useEffect(() => {
    const page = root.current;
    if (!page || locale === "es") return;
    const previous = document.documentElement.lang;
    document.documentElement.lang = "en";
    const textHistory = new Map<Text, { source: string; output: string }>();
    const attributeHistory = new Map<Element, Map<string, { source: string; output: string }>>();
    const pending = new Map<string, Promise<string | undefined>>();
    let stopped = false;
    let observer: MutationObserver | undefined;
    let frame = 0;

    void import("./english").then(({ english }) => {
      if (stopped) return;
      function find(source: string) {
        const value = source.trim();
        const exact = english(value);
        if (exact) return Promise.resolve(exact);
        if (!automatic.current || !/\p{L}/u.test(value)) return Promise.resolve(undefined);
        let result = pending.get(value);
        if (!result) {
          result = automatic.current.translate(value).then((text) => text.trim()).catch(() => undefined);
          pending.set(value, result);
        }
        return result;
      }

      const withWhitespace = (source: string, translated: string) =>
        (source.match(/^\s*/)?.[0] ?? "") + translated + (source.match(/\s*$/)?.[0] ?? "");

      function visitText(node: Text) {
        if (node.parentElement?.closest(skip)) return;
        const source = node.data;
        if (!source.trim() || textHistory.get(node)?.output === source) return;
        void find(source).then((translated) => {
          if (stopped || !translated || source !== node.data || !page?.contains(node)) return;
          const output = withWhitespace(source, translated);
          if (output === source) return;
          textHistory.set(node, { source, output });
          node.data = output;
        });
      }

      function visitElement(element: Element) {
        if (element.closest(skip)) return;
        for (const key of attributes) {
          const source = element.getAttribute(key);
          if (!source?.trim() || attributeHistory.get(element)?.get(key)?.output === source) continue;
          void find(source).then((output) => {
            if (stopped || !output || source === output || element.getAttribute(key) !== source || !page?.contains(element)) return;
            const history = attributeHistory.get(element) ?? new Map();
            history.set(key, { source, output });
            attributeHistory.set(element, history);
            element.setAttribute(key, output);
          });
        }
      }

      function scan() {
        // Update text nodes without replacing React-managed elements or form controls.
        for (const node of textHistory.keys()) if (!page?.contains(node)) textHistory.delete(node);
        for (const element of attributeHistory.keys()) if (!page?.contains(element)) attributeHistory.delete(element);
        const walk = document.createTreeWalker(page!, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        for (let node = walk.nextNode(); node; node = walk.nextNode()) {
          if (node instanceof Text) visitText(node);
          else if (node instanceof Element) visitElement(node);
        }
      }

      observer = new MutationObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(scan);
      });
      observer.observe(page, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attributes] });
      scan();
    });
    return () => {
      stopped = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      for (const [node, { source, output }] of textHistory) if (node.data === output) node.data = source;
      for (const [element, history] of attributeHistory) {
        for (const [name, { source, output }] of history) if (element.getAttribute(name) === output) element.setAttribute(name, source);
      }
      document.documentElement.lang = previous;
    };
  }, [locale, modelVersion]);

  return <Language.Provider value={{ locale, setLocale }}><div ref={root} data-language={locale}>
    {children}
    {locale === "en" && mode === "partial" && <p className="ai-language-note" data-arkez-localized>
      Some content is available in Spanish. If your browser supports on-device translation, select EN to enable it.
    </p>}
  </div></Language.Provider>;
}

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();
  return <div className="ai-language" role="group" aria-label={locale === "es" ? "Idioma del sitio" : "Site language"} data-arkez-localized>
    <button type="button" lang="es" aria-label="Español" aria-pressed={locale === "es"} onClick={() => setLocale("es")}>ES</button>
    <button type="button" lang="en" aria-label="English" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
  </div>;
}
