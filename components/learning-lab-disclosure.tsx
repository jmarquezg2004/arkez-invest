"use client";

import { lazy, Suspense, useState } from "react";

const LearningLab = lazy(() => import("./learning-lab").then(({ LearningLab }) => ({ default: LearningLab })));

export function LearningLabDisclosure() {
  const [loaded, load] = useState(false);

  return (
    <details className="quick-lab" onToggle={(event) => { if (event.currentTarget.open) load(true); }}>
      <summary>Probar el laboratorio financiero</summary>
      {loaded ? (
        <Suspense fallback={<p role="status">Cargando ejercicios…</p>}>
          <LearningLab />
        </Suspense>
      ) : <p><a href="/herramientas/#laboratorio">Abrir los cuatro ejercicios en Herramientas</a></p>}
    </details>
  );
}
