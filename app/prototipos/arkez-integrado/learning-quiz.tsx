"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Building2, Calculator, Check, Clock3, Compass, Layers3, RotateCcw, ScanLine } from "lucide-react";
import { learningPath, learningQuestions, type Answers } from "./learning-path";

const scenes = {
  goal: { title: "Tu punto de partida", art: "/brand/prisma-720.webp", Icon: Compass },
  level: { title: "Lo que ya conoces", art: "/brand/estratos-900.webp", Icon: Layers3 },
  topic: { title: "Tu tema de estudio", art: "/brand/estudio-980.webp", Icon: ScanLine },
  time: { title: "El ritmo que te sirve", art: "/brand/estratos-900.webp", Icon: Clock3 },
  format: { title: "Cómo prefieres aprender", art: "/brand/estudio-980.webp", Icon: BookOpen },
  focus: { title: "Dentro de la empresa", art: "/brand/prisma-720.webp", Icon: Building2 },
};
const goalIcons = [BookOpen, Building2, Calculator, Layers3];
const formatIcons = [BookOpen, BarChart3, Calculator];
const resultArt = {
  Empieza: "/brand/prisma-720.webp",
  Aplica: "/brand/estudio-980.webp",
  Expande: "/brand/estratos-900.webp",
};

export function LearningQuiz({ base }: { base: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const questions = learningQuestions(answers);
  const question = questions[step];
  const result = finished ? learningPath(answers) : null;

  useEffect(() => {
    if (moveFocus.current) {
      heading.current?.focus();
      moveFocus.current = false;
    }
  }, [step, finished]);

  function move(next: number) {
    moveFocus.current = true;
    setStep(next);
    setFinished(false);
  }

  function choose(value: string) {
    setAnswers((previous) => question.id === "goal" && previous.goal !== value
      ? { ...previous, goal: value as Answers["goal"], topic: undefined, focus: undefined }
      : { ...previous, [question.id]: value });
  }

  const canContinue = question.options.some(([value]) => answers[question.id] === value);
  const last = step === questions.length - 1;

  const scene = scenes[question.id];
  const SceneIcon = result ? Check : scene.Icon;
  const sceneKey = result ? result.level : question.id;
  return <div className="ai-quiz-experience">
    <div className="ai-quiz-scene" key={sceneKey}>
      <img src={result ? resultArt[result.level] : scene.art} width="720" height="450" alt="" decoding="async" />
      <div className="ai-quiz-scene-label"><SceneIcon size={23} aria-hidden="true" /><span>{result ? "Tu ruta está lista" : scene.title}</span></div>
    </div>
    <div className="ai-quiz-panel">
    {result ? <>
      <div className="ai-quiz-status"><Compass size={18} aria-hidden="true" /> {result.level} · {result.session}</div>
      <h2 ref={heading} tabIndex={-1}>{result.title}</h2>
      <p className="ai-quiz-prompt">{result.prompt} {result.focus}</p>
      <section className="ai-quiz-first" aria-labelledby="learning-first">
        <p className="ai-quiz-status" id="learning-first">Empieza aquí · {result.first.format}</p>
        <h3>{result.first.title}</h3><p>{result.first.task}</p>
        <a className="ai-quiz-primary" href={base + result.first.path}>Abrir primer recurso <ArrowUpRight size={18} aria-hidden="true" /></a>
      </section>
      <h3 className="ai-quiz-next-title">{answers.time === "hoy" ? "Si quieres seguir después" : "Tus próximas dos sesiones"}</h3>
      <ol className="ai-quiz-next" start={2}>
        {result.next.map(({ path, format, title, task }) => <li key={path}>
          <a href={base + path}>{title} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <p>{format} · {task}</p>
        </li>)}
      </ol>
      <p className="ai-quiz-note">Orientación educativa para elegir qué estudiar. No constituye asesoría de inversión.</p>
      <div className="ai-quiz-actions">
        <button className="ai-quiz-secondary" type="button" onClick={() => move(0)}><ArrowLeft size={17} aria-hidden="true" /> Editar respuestas</button>
        <button className="ai-quiz-secondary" type="button" onClick={() => { setAnswers({}); move(0); }}><RotateCcw size={17} aria-hidden="true" /> Empezar de nuevo</button>
      </div>
    </> : <>
      <div className="ai-quiz-progress" aria-hidden="true">
        {questions.map(({ id }, index) => <span key={id} data-filled={index <= step} />)}
      </div>
      <p className="ai-quiz-status">{step === 0 ? "Pregunta 1 · 5 o 6 en total" : `Pregunta ${step + 1} de ${questions.length}`}</p>
      <h2 ref={heading} id="learning-question" tabIndex={-1}>{question.title}</h2>
      <fieldset className="ai-quiz-options" aria-labelledby="learning-question" key={question.id}>
        {question.options.map(([value, label], index) => {
          const OptionIcon = question.id === "goal" ? goalIcons[index] : question.id === "format" ? formatIcons[index] : scene.Icon;
          return <label key={value}>
          <input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => choose(value)} />
          <span className="ai-quiz-option-icon"><OptionIcon size={19} aria-hidden="true" /></span>
          <span className="ai-quiz-option-label">{label}</span>
        </label>; })}
      </fieldset>
      <div className="ai-quiz-actions">
        {step > 0 && <button className="ai-quiz-secondary" type="button" onClick={() => move(step - 1)}><ArrowLeft size={17} aria-hidden="true" /> Atrás</button>}
        <button className="ai-quiz-primary" type="button" disabled={!canContinue} onClick={() => {
          if (!last) return move(step + 1);
          moveFocus.current = true;
          setFinished(true);
        }}>{last ? "Ver mi ruta" : "Continuar"} <ArrowRight size={18} aria-hidden="true" /></button>
      </div>
    </>}
    </div>
  </div>;
}
