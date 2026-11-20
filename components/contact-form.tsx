"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const choices = [
  ["educacion-financiera", "Educación financiera"],
  ["analisis-de-mercados", "Análisis de mercados"],
  ["formacion-practica", "Formación práctica"],
  ["consultoria-financiera", "Consultoría financiera"],
] as const;

const challengeUrl = "/api/contacto/prueba";
type Proof = { token: string; waitMs: number; receivedAt: number };
type Phase = "loading" | "ready" | "offline" | "sending" | "success";

async function getProof(signal?: AbortSignal): Promise<Proof> {
  const response = await fetch(challengeUrl, { cache: "no-store", signal });
  if (!response.ok) throw new Error("No se pudo iniciar la prueba");
  const { token, waitMs } = await response.json();
  return { token, waitMs, receivedAt: performance.now() };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const proof = useRef<Proof | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("servicio");
    if (topicRef.current && requested && choices.some(([value]) => value === requested)) {
      topicRef.current.value = requested;
    }
    if (!["127.0.0.1", "localhost"].includes(window.location.hostname)) {
      setPhase("offline");
      return;
    }

    const controller = new AbortController();
    getProof(controller.signal).then((challenge) => {
      proof.current = challenge;
      setPhase("ready");
    }).catch(() => {
      if (!controller.signal.aborted) setPhase("offline");
    });
    return () => controller.abort();
  }, []);

  function fillExample() {
    if (!nameRef.current || !emailRef.current || !topicRef.current || !messageRef.current) return;
    nameRef.current.value = "Persona de prueba";
    emailRef.current.value = "ejemplo@example.com";
    topicRef.current.value ||= "educacion-financiera";
    messageRef.current.value = "Me interesa saber cómo se organiza la formación para comparar alternativas financieras.";
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "ready" && phase !== "success") return;

    const fields = [nameRef.current, messageRef.current];
    for (const field of fields) {
      if (!field) return;
      field.setCustomValidity(field.value.trim().length < field.minLength ? "Completa el campo con texto para la prueba." : "");
      if (!field.reportValidity()) return;
    }

    setPhase("sending");
    setError("");
    try {
      const cached = proof.current;
      const challenge = cached && performance.now() - cached.receivedAt < 4 * 60_000
        ? cached
        : await getProof();
      const wait = challenge.waitMs - (performance.now() - challenge.receivedAt);
      if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
      proof.current = null;
      const response = await fetch(challengeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: challenge.token, trapFilled: Boolean(trap.current?.value) }),
      });
      if (!response.ok) {
        setError(response.status === 429
          ? "Se alcanzó el límite de pruebas. Espera un minuto y vuelve a intentarlo."
          : "La prueba no fue aceptada. Revisa los campos y vuelve a intentarlo.");
        setPhase("ready");
        return;
      }
      formRef.current?.reset();
      setPhase("success");
    } catch {
      proof.current = null;
      setPhase("ready");
      setError("No se pudo completar la prueba local. Verifica que el servidor siga abierto.");
    }
  }

  return (
    <section className="contact-section" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title">Solicita información</h2>
      <p id="contact-demo-note">Usa datos ficticios. Esta demostración verifica el formulario en tu equipo y deja el nombre, correo y mensaje en tu navegador.</p>
      <form ref={formRef} onSubmit={submit} method="post" action="/contacto/" aria-describedby="contact-demo-note">
        <fieldset disabled={phase === "offline"} className="contact-fields">
          <legend className="sr-only">Datos de prueba</legend>
          <div>
            <label htmlFor="contact-name">Nombre</label>
            <input ref={nameRef} id="contact-name" required minLength={2} maxLength={100} autoComplete="off" onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </div>
          <div>
            <label htmlFor="contact-email">Correo electrónico</label>
            <input ref={emailRef} id="contact-email" type="email" required maxLength={254} autoComplete="off" />
          </div>
          <div className="contact-field-wide">
            <label htmlFor="contact-topic">Servicio de interés</label>
            <select ref={topicRef} id="contact-topic" required defaultValue="">
              <option value="" disabled>Selecciona un servicio</option>
              {choices.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </div>
          <div className="contact-field-wide">
            <label htmlFor="contact-message">¿Qué te gustaría consultar?</label>
            <textarea ref={messageRef} id="contact-message" rows={4} required minLength={10} maxLength={1200} autoComplete="off" onInput={(event) => event.currentTarget.setCustomValidity("")} />
          </div>
          <div hidden aria-hidden="true">
            <label htmlFor="contact-website">Deja este campo vacío</label>
            <input ref={trap} id="contact-website" tabIndex={-1} autoComplete="off" />
          </div>
        </fieldset>
        <div className="contact-actions">
          <button type="submit" className="button button-dark" disabled={phase !== "ready" && phase !== "success"}>
            {phase === "sending" ? "Comprobando…" : "Probar solicitud"}
          </button>
          <button type="button" className="button button-outline" onClick={fillExample} disabled={phase !== "ready" && phase !== "success"}>Usar datos de ejemplo</button>
        </div>
        <noscript><p>Activa JavaScript en la vista previa local para probar el formulario.</p></noscript>
        <p className="contact-status" role="status">
          {phase === "offline" && "Abre la vista con el servidor local incluido en la descarga para probar el formulario."}
          {phase === "success" && "Prueba completada. Tus datos permanecieron en el navegador."}
        </p>
        {error && <p className="contact-error" role="alert">{error}</p>}
      </form>
    </section>
  );
}
