# Arkez Experience · Fase 7

La experiencia traduce una decisión financiera a tres caminos. Desde Empieza se pasa de conceptos a ejemplos. Aplica permite probar el registro, el escenario inmobiliario y los mapas. Expande propone evaluar herramientas para un equipo y enlaza a la formación y la consulta que ya existen. El prototipo usa datos ficticios y no realiza recomendaciones personalizadas.

## Auditoría de integración

Se buscaron fuentes en la rama sincronizada, el espacio de trabajo y los repositorios autorizados que devolvió el conector para `jmarquezg2004`. Además de `arkez-invest`, el listado mostró `Perfil-de-Inversionista` con tamaño cero. Dentro del sitio, la calculadora es el único producto propio de la lista solicitado cuyo código y ruta pudieron verificarse.

| Producto | Estado | Módulo de revisión | Material pendiente |
| --- | --- | --- | --- |
| Registro de inversiones | Integración pendiente. Vista de ejemplo que filtra, suma y añade un movimiento ficticio en memoria | `LedgerDemo` | Repositorio, esquema de movimientos y política de datos |
| Evaluador inmobiliario | Integración pendiente. Modelo educativo de precio, gastos y evolución estimada a cinco años | `PropertyDemo`, `projectProperty` | Repositorio y modelo original, unidades, costos y horizonte confirmados |
| Infografía de infraestructura IA | Integración pendiente. La demostración usa documentación pública por vínculo | `AiMap`, `experience-ai.ts` | Artefacto original y derechos de uso, referencias y responsable de actualización |
| Mapa de empresas IA | Integración pendiente. El mapa de demostración indica relaciones técnicas independientes | `AiMap`, `experience-ai.ts` | Inventario original con fuentes, fechas y política editorial |
| Calculadora de interés compuesto | Disponible. La vista inicial importa el mismo cálculo y enlaza a la calculadora real | `ExperienceHero`, `lib/compound-interest.ts` | — |

El registro de integraciones en `lib/experience-products.ts` distingue una ruta disponible de una integración pendiente con ancla local. No se crearon URLs externas, conectores, cuentas ni almacenamiento. La consulta sobre operaciones internacionales remite al canal de consultoría existente, en modo de prueba. Es un tema propuesto para formación especializada y no una oferta confirmada.

## Fuentes del mapa

Cada arista usa una referencia propia. Que dos relaciones compartan categoría no significa que constituyan una cadena de despliegue o una alianza.

- Nube y cómputo. Amazon identifica H100 en las especificaciones de EC2 P5. [Amazon EC2](https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html)
- Nube e inferencia. Google documenta una opción de despliegue de modelos con vLLM. [Google Cloud](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/open-models/vllm/use-vllm)
- Inferencia y aplicaciones. El servidor vLLM ofrece una interfaz HTTP compatible con la API de OpenAI. [vLLM](https://docs.vllm.ai/en/stable/serving/openai_compatible_server/)

## Animaciones

- **Motion.** El encabezado usa `LayoutGroup`, `layout="position"` y un indicador compartido con `layoutId`. Las mismas tres superficies cambian de sitio según el nivel. En Empieza el gráfico ocupa la derecha, en Aplica el registro pasa a la izquierda y en Expande el diagrama ocupa todo el ancho superior. Reproducir alterna los tres niveles y reiniciar vuelve al primero. [Transiciones de diseño de Motion](https://motion.dev/docs/react-layout-animations)
- **GSAP.** `scroll-engine.ts` importa GSAP y ScrollTrigger al aproximarse a la sección. El panel se fija con `pin` y `scrub` relaciona la geometría de tres planos con el desplazamiento. Reproducir mueve el desplazamiento nativo por ese intervalo. Pausar detiene la reproducción y reiniciar vuelve a la primera etapa. Con movimiento reducido o en ventanas bajas, la secuencia ofrece un control de paso sin fijación. [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · [Licencia estándar de GSAP](https://gsap.com/community/standard-license/)

## Abrir y validar

La única ruta nueva es `/prototipos/arkez-experience/`. Para revisarla, ejecuta `ARKEZ_INDEXABLE=0 npm run build` y `npm run preview`. La URL local usa el puerto 4173. En el perfil indexable la ruta queda excluida y el sitemap conserva las 28 páginas públicas. El Design Showcase anterior conserva su código y su ruta de revisión sin integrarse en la web.
