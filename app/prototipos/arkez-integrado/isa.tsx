"use client";

import { Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "./language";
import { base } from "./routes";

const text = {
  es: {
    launch: "Pregúntale a ISA", name: "ISA · Asistente de Arkez", close: "Cerrar asistente",
    intro: "Pide un ejemplo de lo que estás leyendo o encuentra una guía para seguir.",
    example: "¿Me das un ejemplo?", resources: "Ver una guía", reading: "Estás leyendo",
    label: "Tu pregunta", ask: "Preguntar", waiting: "Buscando una explicación…",
    note: "Ayuda educativa. Evita incluir datos personales o financieros.",
    unavailable: "La IA está pendiente de activación en esta vista previa. Puedes usar las respuestas guiadas.",
    error: "ISA no pudo responder esta vez. Prueba con un ejemplo guiado.",
    link: "Abrir recurso",
  },
  en: {
    launch: "Ask ISA", name: "ISA · Arkez assistant", close: "Close assistant",
    intro: "Ask for an example of what you're reading or find a guide to keep learning.",
    example: "Can you give an example?", resources: "Find a guide", reading: "You're reading",
    label: "Your question", ask: "Ask", waiting: "Looking for an explanation…",
    note: "For learning. Please leave out personal and financial information.",
    unavailable: "AI is awaiting activation in this preview. Guided answers are available.",
    error: "ISA couldn't answer this time. Try a guided example.",
    link: "Open resource",
  },
};

const lessons = [
  {
    cue: /objetivo|goal/i,
    es: "Isa quiere pagar un curso de fotografía de USD 180. Si ya tiene USD 60, le faltan USD 120. Así convierte un propósito general en una meta concreta.",
    en: "Isa wants to pay for a USD 180 photography course. If she's saved USD 60, she needs another USD 120. She now has a clear goal.",
  },
  {
    cue: /necesitar|plazo|deadline|when will|matrícula|fixed/i,
    es: "La matrícula vence en junio. Si el dinero solo está disponible en agosto, hay un desfase de dos meses. Escribe las dos fechas en el mismo calendario.",
    en: "Tuition is due in June. If the money is only available in August, there's a two-month gap. Put both dates on the same calendar.",
  },
  {
    cue: /pérdida|loss|caída|riesgo|risk|volatil/i,
    es: "Si Isa tiene USD 180 reservados para la matrícula y su saldo cae USD 30, le quedan USD 150. El ejercicio es calcular cómo la caída cambia la fecha o el importe que aún necesita.",
    en: "If Isa has reserved USD 180 for tuition and her balance drops by USD 30, she's left with USD 150. Work out how that changes the timing or the amount she still needs.",
  },
  {
    cue: /cost|comisión|fees/i,
    es: "En una simulación de USD 200, la opción A cobra USD 5 por abrir y USD 2 al mes. La B cobra USD 3 al mes. Compara el costo total de seis meses en ambas.",
    en: "In a fictional USD 200 example, option A charges USD 5 to open and USD 2 per month. Option B charges USD 3 per month. Compare their totals over six months.",
  },
  {
    cue: /fuentes|verificar|source|checking/i,
    es: "Dos informes muestran cifras distintas. Antes de compararlas, comprueba qué periodo cubren y si están en USD o en millones de USD.",
    en: "Two reports show different figures. First check their reporting periods and whether they're in dollars or millions of dollars.",
  },
  {
    cue: /liquidez|cash flow|liquidity|caja/i,
    es: "Un negocio factura USD 900 hoy y cobra en 30 días. Si paga USD 300 de alquiler esta semana, apunta el cobro y el pago en fechas distintas para revisar el efectivo disponible.",
    en: "A business invoices USD 900 today and is paid in 30 days. If USD 300 rent is due this week, plot the payment and the receipt separately to see how much cash is available.",
  },
];

export function IsaAssistant() {
  const { locale } = useLanguage();
  const copy = text[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const [context, setContext] = useState({ heading: "", excerpt: "" });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ message: string; href?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    if (dialog.current?.open) dialog.current.close();
  }, [locale]);

  function open() {
    const headings = [...document.querySelectorAll<HTMLElement>(".ai-illustrated-sections h2, .ai-illustrated-sections h3, .ai-workshop-lessons h3")];
    const nearby = headings.filter((node) => node.getBoundingClientRect().top <= innerHeight * .52).at(-1)
      ?? headings[0] ?? document.querySelector<HTMLElement>(".ai-preview-content h1");
    const paragraph = nearby?.nextElementSibling;
    setContext({ heading: nearby?.textContent?.trim().slice(0, 130) ?? "", excerpt: paragraph?.tagName === "P" ? paragraph.textContent?.trim().slice(0, 360) ?? "" : "" });
    setAnswer(null);
    setQuestion("");
    dialog.current?.showModal();
  }

  function example() {
    const lesson = lessons.find(({ cue }) => cue.test(context.heading));
    setAnswer({
      message: lesson?.[locale] ?? (locale === "es"
        ? "Elige una cifra del tema que estás leyendo. Escribe qué mide, para qué periodo y de dónde sale. Después cambia un solo supuesto y observa qué parte de tu explicación cambia."
        : "Pick a figure from what you're reading. Write what it measures, which period it covers and where it comes from. Then change one assumption and see what changes in your explanation."),
    });
  }

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || request.current) return;
    const current = new AbortController();
    request.current = current;
    setBusy(true);
    try {
      const response = await fetch("/api/isa", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), locale, ...context }), signal: current.signal,
      });
      if (current.signal.aborted) return;
      if ([404, 503].includes(response.status)) { setAnswer({ message: copy.unavailable }); return; }
      const result = response.ok ? await response.json() : null;
      if (!current.signal.aborted) setAnswer({ message: typeof result?.answer === "string" ? result.answer : copy.error });
    } catch {
      if (!current.signal.aborted) setAnswer({ message: copy.error });
    } finally {
      if (request.current === current) { request.current = null; setBusy(false); }
    }
  }

  return <div data-arkez-localized>
    <button className="isa-launch" type="button" ref={launcher} aria-haspopup="dialog" onClick={open}>
      <Sparkles aria-hidden="true" size={19} />{copy.launch}
    </button>
    <dialog className="isa-panel" ref={dialog} aria-labelledby="isa-title" onClose={() => {
      request.current?.abort();
      request.current = null;
      setBusy(false);
      launcher.current?.focus();
    }}>
      <header><h2 id="isa-title"><Sparkles aria-hidden="true" size={18} />{copy.name}</h2>
        <button className="isa-close" type="button" aria-label={copy.close} onClick={() => dialog.current?.close()}><X size={20} /></button>
      </header>
      <p>{copy.intro}</p>
      {context.heading && <p className="isa-small">{copy.reading} · {context.heading}</p>}
      <div className="isa-actions">
        <button type="button" disabled={busy} onClick={example}>{copy.example}</button>
        <button type="button" disabled={busy} onClick={() => setAnswer({
          message: locale === "es" ? "La guía de primeros pasos tiene preguntas sobre objetivo, plazo, costos, pérdida y fuentes."
            : "The first steps guide has questions about goals, deadlines, costs, losses and sources.",
          href: base + "/recursos/guias/primeros-pasos/",
        })}>{copy.resources}</button>
      </div>
      <div role="status">{(busy || answer) && <div className="isa-response">
        <p>{busy ? copy.waiting : answer?.message}</p>
        {!busy && answer?.href && <a href={answer.href}>{copy.link}</a>}
      </div>}</div>
      <form onSubmit={ask}>
        <label htmlFor="isa-question">{copy.label}</label>
        <textarea id="isa-question" value={question} maxLength={360} required onChange={(event) => setQuestion(event.target.value)} aria-describedby="isa-note" />
        <button type="submit" disabled={busy} aria-disabled={busy}>{copy.ask}</button>
      </form>
      <p className="isa-small" id="isa-note">{copy.note}</p>
    </dialog>
  </div>;
}
