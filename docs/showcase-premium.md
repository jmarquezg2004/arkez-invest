# Arkez Invest · Investigación y Design Showcase

La prueba vive en `/prototipos/design-system-premium/`. Solo se exporta en el perfil de revisión, con `noindex`, fuera del sitemap y de la navegación pública. Las 28 rutas públicas conservan sus componentes. La siguiente integración depende de la aprobación del showcase.

## A. Código y demostraciones examinados

Los enlaces de GitHub fijan el commit revisado. Para Aceternity se consultó el código distribuido por su registro o por el panel de instalación de la demo. La licencia de cada biblioteca determina qué se incorporó. Los componentes de demostración que no se incorporaron sirvieron para estudiar una técnica.

| Componente y código exacto | Biblioteca | Licencia del código | Técnica observada | Aplicación en Arkez |
| --- | --- | --- | --- | --- |
| [TiltedCard](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-default/Components/TiltedCard/TiltedCard.tsx) | React Bits | MIT + Commons Clause | Geometría del puntero, bucle de interpolación y pausa fuera de la vista | Perspectiva inicial discreta que se aplana al interactuar |
| [SpotlightCard](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx) | React Bits | MIT + Commons Clause | Coordenadas locales y luz interpolada, con tratamiento de foco y visibilidad | Iluminar el área de decisión y conservar un foco visible |
| [ScrollReveal](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx) | React Bits | MIT + Commons Clause | GSAP, ScrollTrigger, rangos y media queries | Enlazar la revelación a capítulos mediante CSS nativo |
| [PixelTransition](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-default/Animations/PixelTransition/PixelTransition.tsx) | React Bits | MIT + Commons Clause | Cuadrícula de transición con fotogramas bajo demanda | Evitar el ruido en cifras, conservar la continuidad al cambiar de estado |
| [Aurora](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-default/Backgrounds/Aurora/Aurora.tsx) | React Bits | MIT + Commons Clause | Shader con bucle condicionado por visibilidad | Fondo radial con retícula CSS, sin ciclo permanente |
| [3D Card Effect](https://ui.aceternity.com/registry/3d-card.json) | Aceternity UI | Fuente gratuita de registro. Sin MIT verificado para el archivo | Contexto de interacción, coordenadas locales y capas en profundidad | Plano de producto sin inclinar cifras en foco |
| [Wobble Card](https://ui.aceternity.com/registry/wobble-card.json) | Aceternity UI | Fuente gratuita de registro. Sin MIT verificado para el archivo | Traslación interna y escala guiadas por el puntero | Pequeñas respuestas de las capas de cada tarjeta |
| [Apple Cards Carousel](https://ui.aceternity.com/registry/apple-cards-carousel.json) | Aceternity UI | Fuente gratuita de registro. Sin MIT verificado para el archivo | Desplazamiento del carrusel y apertura de detalle | Mantener contexto con vínculos directos y diseño adaptable |
| [Background Beams](https://ui.aceternity.com/registry/background-beams.json) | Aceternity UI | Fuente gratuita de registro. Sin MIT verificado para el archivo | Rutas SVG y gradientes animados | El trazado aparece una vez para explicar cada escena |
| [Bento Grid](https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/apps/www/registry/magicui/bento-grid.tsx) | Magic UI | MIT | Contenedores con capas, información que se desplaza y CTA en flujo | Tres composiciones propias que salen del mismo sistema visual |
| [Animated Beam](https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/apps/www/registry/magicui/animated-beam.tsx) | Magic UI | MIT | Ruta entre elementos, ResizeObserver y gradiente Motion | Cableado nominal del recorrido con un viewBox estable |
| [Safari](https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/apps/www/registry/magicui/safari.tsx) | Magic UI | MIT | Interfaz enmarcada con viewport y capas de fondo | Marcos de software con etiqueta común y contenido funcional |
| [Number Ticker](https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/apps/www/registry/magicui/number-ticker.tsx) | Magic UI | MIT | Ref, valor Motion, resorte y activación según visibilidad | **Código adaptado**. Porcentaje localizado, cifra accesible final y actualización inmediata con movimiento reducido |
| [In View](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/in-view.tsx) | Motion Primitives | MIT | Compartir detección de visibilidad entre hijos | Etapas sincronizadas con la posición del recorrido |
| [Morphing Dialog](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/morphing-dialog.tsx) | Motion Primitives | MIT | layoutId, portal, cierre y traslado de foco | Mantener una superficie estable para los datos, sin añadir un modal |
| [Text Morph](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/text-morph.tsx) | Motion Primitives | MIT | Identificadores por carácter, AnimatePresence y layout | Mantener coherencia visual de cifras con números tabulares |
| [Carousel](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/carousel.tsx) | Motion Primitives | MIT | Arrastre con Motion y cambio de página | Controles nativos que funcionan sin gesto |
| [Portfolio Allocation](https://github.com/abderrahimghazali/shadcn-fintech/blob/a905058c75a840896d27a16991f2e7cc1ca06f3f/src/components/investments/portfolio-allocation.tsx) | Shadcn Fintech | MIT | PieChart con activo enfocado y categorías | Selección compartida entre dos barras comparables con escala 100 % |
| [Performance Chart](https://github.com/abderrahimghazali/shadcn-fintech/blob/a905058c75a840896d27a16991f2e7cc1ca06f3f/src/components/investments/performance-chart.tsx) | Shadcn Fintech | MIT | AreaChart con periodos, cuadrícula, eje y tooltip | Área entre capital y aportes con inspección precisa por año |
| [Holdings Table](https://github.com/abderrahimghazali/shadcn-fintech/blob/a905058c75a840896d27a16991f2e7cc1ca06f3f/src/components/investments/holdings-table.tsx) | Shadcn Fintech | MIT | Línea compacta por posición, actualización y selección | Usar gráficos compactos como entrada a una tarea, siempre con unidades |

Licencias consultadas. [React Bits](https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/LICENSE) · [Aceternity UI](https://ui.aceternity.com/licence) · [Magic UI](https://github.com/magicuidesign/magicui/blob/b0b2e4974b1b68cd5278277c6837a27736e20c3a/LICENSE.md) · [Motion Primitives](https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/LICENCE.md) · [Shadcn Fintech](https://github.com/abderrahimghazali/shadcn-fintech/blob/a905058c75a840896d27a16991f2e7cc1ca06f3f/LICENSE). El repositorio conserva el aviso íntegro de Magic UI en [licencias/magic-ui-mit.md](licencias/magic-ui-mit.md).

## B. Referencias visuales

| Referencia | Componente | Técnica observada | Aplicación |
| --- | --- | --- | --- |
| [Awwwards · caso Viens-là](https://assets.awwwards.com/assets/files/live-presentation.pdf) | Secuencia narrativa y microinteracciones | Revelación por desplazamiento, jerarquía, ritmo entre escenas y adaptación de navegación | Tablero fijo junto al recorrido en escritorio. Tres controles explícitos en móvil |
| [Awwwards · Mobile Excellence](https://www.awwwards.com/mobile-excellence-guidelines.pdf) | Primera pantalla móvil | Acciones visibles, carga inicial limitada y ausencia de desplazamiento horizontal | Encabezado corto, controles nativos y tarjeta de una columna |
| [Mercury](https://mercury.com/) | Escenas que presentan interfaz y beneficio | La interfaz demuestra el producto, con superficies y datos jerarquizados | El primer panel ya permite cambiar de escenario y comparar dos carteras |
| [Relay](https://relayfi.com/) | Muestras de pagos y cobros | UI concreta por tarea, con agrupación visual y montos legibles | Demostración de cobros y pagos en la tarjeta empresarial |
| [Framer](https://www.framer.com/) | Presentaciones de edición y composición | Las capas se organizan alrededor del resultado y la transición conserva el contexto | Marcos con una superficie por tarea, ilustraciones con profundidad y secuencias coordinadas |

## C. Decisiones de ingeniería

- **Motion y GSAP.** Motion aporta el resorte del contador. `position: sticky`, un seguimiento pasivo de capítulos y `animation-timeline` conservan el desplazamiento nativo. GSAP ScrollTrigger ofrece `pin`, `scrub` y secuencias más complejas. El recorrido de tres etapas no requiere esa dependencia ni WebGL. [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · [Motion Layout](https://motion.dev/docs/react-layout-animations)
- **Recharts.** Sus componentes de área y sector, ejes, leyendas y tooltips son útiles si crecen los requisitos de visualización. Dependencia y superficie ampliadas para dos escalas lineales y dos barras. [Recharts](https://github.com/recharts/recharts)
- **visx.** Sus primitivas permiten incorporar escalas y geometría de forma selectiva. Las visualizaciones del showcase ya tienen pocas series y ejes comunes. [visx](https://visx.airbnb.tech/)
- **Nivo.** Dispone de componentes React sobre D3, con SVG y opciones Canvas para conjuntos grandes. SVG y controles HTML ofrecen acceso a todos los datos de estas muestras pequeñas. [Nivo](https://nivo.rocks/)
- **D3.** Las escalas y generadores de rutas serían útiles con ejes logarítmicos, interpolación avanzada o múltiples dominios. El prototipo conserva las fórmulas de Arkez y usa un solo componente de cuadrícula y escalas lineales para sus gráficos. [D3](https://d3js.org/what-is-d3)

## D. Componentes y comparación

| Actual, commit `7d5267c` | Prototipo | Archivo |
| --- | --- | --- |
| Ilustración de portada con una serie educativa superpuesta | Interfaz en perspectiva con tres escenarios, observación seleccionable, dos carteras y leyenda compartida | `dashboard.tsx`, `number-ticker.tsx` |
| Tres tarjetas con motivos financieros simples | Guía física en capas, pantalla de mercado y panel de caja diferenciados | `services.tsx` |
| Calculadora rápida y sección de herramientas | Dos entradas de producto con datos calculados y una proyección anual con área, inspección y comparación al 0 % | `tool-dock.tsx`, `growth.tsx`, `visuals.tsx` |
| Parallax en la portada y relato en Innovation Hub | Panel de etapa vinculado al scroll, con versión controlada por botones | `story.tsx` |
| Iconos lineales en portada y navegación | Sistema de siluetas con medallones en capas y color semántico | `showcase.tsx`, `showcase.css` |
| Enlaces de noticias y ecosistema junto a una guía | Composición editorial que distingue publicación original, fuente, fecha, guía y plataformas | `showcase.tsx` |

Los módulos se alojan en `components/premium-showcase/`. Para revisar localmente, ejecuta `ARKEZ_INDEXABLE=0 npm run build` y `npm run preview`. Abre la ruta del prototipo desde la dirección de la vista previa. El showcase usa datos educativos y reutiliza `comparePortfolios`, `calculateCompound`, ofertas, fuentes y recursos existentes.
