# Auditoría visual de Arkez NexaCore V2

Compara la exportación de revisión de `f0ae4d6` con la nueva implementación de `/prototipos/arkez-nexacore/`. Las capturas se tomaron en Chromium a 1440 × 960 y 390 × 844. Cada par usa la misma anchura, estado de la interfaz y preferencia de movimiento reducido. La grabación usa movimiento habilitado.

| Archivo o componente V1 | V2 | Diferencia visible y comprobación | Dependencia y licencia |
| --- | --- | --- | --- |
| `lab.tsx` · `Chart` | `financial-chart.tsx` | Escala y unidades en COP, tres series distinguibles por trazo, marcador y guía vertical. Al elegir un periodo cambian las cifras de lectura. Puede ocultarse una serie y abrirse la tabla. | Recharts · MIT |
| `lab.tsx` · evaluador | `lab.tsx` · vistas de valor y resultado | La primera vista contrapone valor real, nominal y sin valorización. La segunda separa flujo real y resultado que incluye el precio inicial. Los mismos supuestos actualizan ambas. | Recharts · MIT |
| `lab.tsx` · `AiLab` | `ai-network.tsx` | Red de cuatro capas con cinco nodos, detalle documental y dos tipos de arista. Selecciona un nodo, busca, filtra y usa los controles de zoom. En móvil la red gira al eje vertical. | React Flow · MIT, Lucide · ISC |
| `interactions.tsx` · `ServiceDeck` y `ServiceGraphic` | `product-scenes.tsx` | Cuaderno con datos de ahorro, escenario de vivienda con supuestos y entregables de compra. Al expandir aparecen controles que cambian la visualización y las cifras. | Lucide · ISC, imagen propia |
| `interactions.tsx` · `Comparison` | `narratives.tsx` · conciliación | Las fuentes pasan de registros separados a una lectura consolidada. El gasto mensual se distingue del capital y el ahorro disponible cubre 3,5 meses al gasto del ejemplo. | Motion · MIT, Lucide · ISC |
| `interactions.tsx` · `LearningStages` | `narratives.tsx` · cuatro escenas | Un solo foco cambia de cuaderno a fuentes, simulación y criterio. La secuencia es reproducible y cada etapa se abre por separado. | Motion · MIT, Lucide · ISC |
| `experience.tsx` · portada | `experience.tsx` y `v2.css` | Se conservan fotografía y composición. Un enlace al pie de la imagen da acceso inmediato a servicios. La capa de luz acompaña el desplazamiento en navegadores compatibles y con movimiento habilitado. | Hirael · MIT, imagen propia |

La comparación se puede repetir con `ARKEZ_INDEXABLE=0 npm run build` y `npm run preview` en cada revisión. Abre `http://127.0.0.1:4173/prototipos/arkez-nexacore/`. Para el módulo de conciliación selecciona **Organizada**. Para la red usa la pestaña **Infraestructura IA** y conserva el nodo seleccionado por defecto. Las cuatro capas de la red y los valores financieros visibles se pueden explorar con el teclado.

La demo remota de NexaCore, 21st.dev, Mercury y Relay quedaron inaccesibles desde la red de trabajo. La referencia verificable de NexaCore fue el código y la licencia de Hirael en `73e8994`. La comparación documentada aquí es del prototipo de Arkez que estaba en la rama, no de esas páginas externas.

La verificación en Chromium cubrió cuatro anchos entre 320 y 1440 px. Se comprobó selección por teclado, activación táctil en móvil, filtros, zoom, reset, leyendas, tablas y ausencia de errores de consola o infracciones de axe en los flujos recorridos. La compilación estática de revisión, TypeScript y 37 pruebas pasaron. En la compilación indexable se volvió a ejecutar el mismo conjunto y se comprobó que el prototipo queda fuera.
