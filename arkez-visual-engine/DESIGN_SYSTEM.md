# Arkez Visual Engine

Vista previa de diseño tecnoeditorial para educación financiera. Las rutas de revisión se encuentran en `/prototipos/arkez-explore/`. La portada y los módulos vigentes de NexaCore se mantuvieron como referencia de navegación y calidad.

| Capa | Contenido |
| --- | --- |
| Marca | `brand-config.json` define nombre, idioma y ruta de revisión. `design-tokens.json` registra la paleta, tipografía y tiempos. Las variables correspondientes en `design.css` controlan el tema ejecutado. |
| Datos | `schemas/research.ts`, `research-data.ts` y `catalog.ts` separan recursos, datos, metadatos y contenidos. Para otro emisor cambia el registro, el arte y el catálogo. |
| Componentes | Navegación, portadas, carrusel, diálogo, guardados, gráfico, mapa regional y cadena seleccionable. |
| Plantillas | `templates/research.tsx` combina módulos según informe, ficha, gráficos, mapa, modelo y estudio. |
| Exportación | HTML local descargable por recurso. PDF mediante diálogo de impresión. PNG y SVG del gráfico financiero. |
| Referencias | `references/README.md` analiza las cuatro piezas aprobadas. `assets/` contiene WebP originales para la vista previa. |

Las imágenes WebP se generaron para esta revisión sin identidad de terceros incrustada. Los componentes emplean Lucide (ISC y atribuciones de Feather), Recharts (MIT) y Motion (MIT) ya instalados. El carrusel de shadcn/ui se consultó como patrón de navegación. La implementación de esta revisión usa desplazamiento nativo con CSS scroll snap y un diálogo HTML. El armazón y sus datos se sirven estáticamente. [Lucide](https://lucide.dev/license) · [Recharts](https://github.com/recharts/recharts) · [shadcn/ui](https://ui.shadcn.com/docs/components/carousel)

Los datos de Nu corresponden a 2023 y 2024. La lectura usa el comunicado y los estados consolidados presentados ante la SEC. El gráfico de EPS básico utiliza dólares por acción. Las cifras agregadas financieras se expresan en millones de dólares. [Comunicado oficial](https://nu.com/en/newsroom/company/nu-holdings-ltd-reports-fourth-quarter-and-full-year-2024-financial-results) · [Estados financieros 6-K](https://www.sec.gov/Archives/edgar/data/1691493/000129281425000480/nufs4q24_6k.htm)

Para los carruseles se revisaron [21st.dev](https://dev.21st.dev/%40kedhareswer/library/image-carousels), [Magic UI Marquee](https://magicui.design/docs/components/marquee) y [Aceternity Cards](https://ui.aceternity.com/categories/card). Se llevó el patrón de tarjetas con avance manual y foco a la vista previa. Para las portadas se revisó la profundidad de [React Bits Tilted Card](https://reactbits.dev/get-started/index) y se llevó el énfasis a luz, recorte y perspectiva de las imágenes. Los controles conservan coordenadas estables al tocar o navegar por teclado.
