"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Building2, Calculator, Check, Clock3, Compass, Layers3, RotateCcw, ScanLine } from "lucide-react";
import mapData from "@/arkez-visual-engine/ai-map-source.json";
import { TopicStory } from "./visual-stories/topic-story";
import { storyForReading } from "./visual-stories/story-links";
import { beginnerKeys, beginnerTopics, learningPath, learningQuestions, type Answers, type BeginnerTopic } from "./learning-path";

const scenes = {
  goal: { title: "Tu punto de partida", art: "/brand/prisma-720.webp", Icon: Compass },
  level: { title: "Lo que ya conoces", art: "/brand/estratos-900.webp", Icon: Layers3 },
  topic: { title: "Tu tema de estudio", art: "/brand/estudio-980.webp", Icon: ScanLine },
  time: { title: "El ritmo que te sirve", art: "/brand/estratos-900.webp", Icon: Clock3 },
  format: { title: "Cómo prefieres aprender", art: "/brand/estudio-980.webp", Icon: BookOpen },
  focus: { title: "Dentro de la empresa", art: "/brand/prisma-720.webp", Icon: Building2 },
};
const goalIcons = [BookOpen, Building2, Calculator, Layers3];
const formatIcons = [BookOpen, BarChart3, Calculator, Building2];
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
const resultArt = {
  Empieza: "/brand/prisma-720.webp",
  Aplica: "/brand/estudio-980.webp",
  Expande: "/brand/estratos-900.webp",
};

export function LearningQuiz({ base }: { base: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [companyInput, setCompanyInput] = useState("");
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
      ? { ...previous, goal: value as Answers["goal"], topic: undefined, focus: undefined, company: undefined, story: undefined }
      : question.id === "level" && previous.level !== value ? { ...previous, level: value as Answers["level"], topic: undefined }
        : question.id === "format" && previous.format !== value ? { ...previous, format: value as Answers["format"], focus: undefined, company: undefined, story: undefined }
          : { ...previous, [question.id]: value });
  }

  const relatedStory = result ? [result.first, ...result.next].map(({ path }) => storyForReading(path))
    .find((href) => href && !href.endsWith(`#historia-tema-${result.story}`)) : undefined;
  const showCompany = question.id === "focus" && answers.focus === "infraestructura";
  const showStory = question.id === "focus" && answers.focus === "historia";
  const search = normalize(companyInput);
  const companies = search ? mapData.nodes.filter(({ id, name, kind }) =>
    kind !== 2 && (normalize(id).includes(search) || normalize(name).includes(search))
  ).slice(0, 8) : [];
  const canContinue = question.options.some(([value]) => answers[question.id] === value)
    && (!showCompany || Boolean(answers.company)) && (!showStory || Boolean(answers.story));
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
      <TopicStory topic={result.story} />
      {result.first.format !== "Visual Story" && <section className="ai-quiz-first" aria-labelledby="learning-first">
        <p className="ai-quiz-status" id="learning-first">Empieza aquí · {result.first.format}</p>
        <h3>{result.first.title}</h3><p>{result.first.task}</p>
        <a className="ai-quiz-primary" href={base + result.first.path}>Abrir primer recurso <ArrowUpRight size={18} aria-hidden="true" /></a>
      </section>}
      <h3 className="ai-quiz-next-title">{answers.time === "hoy" ? "Si quieres seguir después" : "Tus próximas dos sesiones"}</h3>
      <ol className="ai-quiz-next" start={2}>
        {result.next.map(({ path, format, title, task }) => <li key={path}>
          <a href={base + path}>{title} <ArrowUpRight size={16} aria-hidden="true" /></a>
          <p>{format} · {task}</p>
        </li>)}
      </ol>
      {relatedStory && <a className="avs-reading-link" href={relatedStory}>Ver una historia relacionada en Research <ArrowUpRight size={16} aria-hidden="true" /></a>}
      <p className="ai-quiz-note">Orientación educativa para elegir qué estudiar. No constituye asesoría de inversión.</p>
      <div className="ai-quiz-actions">
        <button className="ai-quiz-secondary" type="button" onClick={() => move(0)}><ArrowLeft size={17} aria-hidden="true" /> Editar respuestas</button>
        <button className="ai-quiz-secondary" type="button" onClick={() => { setAnswers({}); setCompanyInput(""); move(0); }}><RotateCcw size={17} aria-hidden="true" /> Empezar de nuevo</button>
      </div>
    </> : <>
      <div className="ai-quiz-progress" aria-hidden="true">
        {questions.map(({ id }, index) => <span key={id} data-filled={index <= step} />)}
      </div>
      <p className="ai-quiz-status">{step === 0 ? "Pregunta 1 · 5 o 6 en total" : `Pregunta ${step + 1} de ${questions.length}`}</p>
      <h2 ref={heading} id="learning-question" tabIndex={-1}>{question.title}</h2>
      <fieldset className="ai-quiz-options" data-question={question.id} aria-labelledby="learning-question" key={question.id}>
        {question.options.map(([value, label], index) => {
          const OptionIcon = question.id === "goal" ? goalIcons[index] : question.id === "format" ? formatIcons[index] : scene.Icon;
          return <label key={value}>
          <input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => choose(value)} />
          <span className="ai-quiz-option-icon"><OptionIcon size={19} aria-hidden="true" /></span>
          <span className="ai-quiz-option-label">{label}</span>
        </label>; })}
      </fieldset>
      {showCompany && <div className="ai-quiz-case">
        <label htmlFor="quiz-ai-company">Nombre o ticker de infraestructura de IA</label>
        <input id="quiz-ai-company" type="search" placeholder="Ej. NVIDIA o NVDA" maxLength={80} value={companyInput} onChange={(event) => {
          setCompanyInput(event.target.value);
          setAnswers({ ...answers, company: undefined });
        }} />
        {search && !companies.length && <p role="status">No encontramos esa empresa en el mapa. Prueba otro nombre o elige una historia financiera.</p>}
        {companies.length > 0 && <ul aria-label="Empresas del mapa">{companies.map(({ id, name }) => <li key={id}>
          <button type="button" aria-pressed={answers.company === id} onClick={() => setAnswers({ ...answers, company: id })}>{name} · {id}</button>
        </li>)}</ul>}
      </div>}
      {showStory && <div className="ai-quiz-case">
        <label htmlFor="quiz-financial-story">Elige una Arkez Visual Story</label>
        <select id="quiz-financial-story" value={answers.story ?? ""} onChange={(event) => setAnswers({ ...answers, story: event.target.value as BeginnerTopic })}>
          <option value="">Selecciona un tema</option>
          {beginnerKeys.map((key) => <option key={key} value={key}>{beginnerTopics[key].label}</option>)}
        </select>
      </div>}
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
