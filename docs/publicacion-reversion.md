# Publicación y reversión de Arkez Invest

Este procedimiento prepara una publicación futura. Ejecutar sólo los pasos de compilación durante la fase local.

## Decisiones que requieren autorización

1. Elegir Cloudflare Pages Direct Upload o mantener el alojamiento actual. Confirmar cuenta, responsables, presupuesto y acceso a homologación.
2. Aprobar el dominio canónico `arkezinvest.com`, la redirección de `www`, el traslado de DNS si se necesita y la ventana de cambio. Aprobar expresamente cualquier modificación de nameservers, DNSSEC y registros de correo.
3. Aprobar el commit y SHA-256 concretos para producción, la exposición pública y el inicio de indexación. El cambio de rama o repositorio remoto es una decisión separada.
4. Autorizar la captación real con Turnstile y Resend, el dominio remitente, el buzón destinatario, la política de privacidad, el plazo de retención y quién podrá acceder a las consultas. Aprobar el límite global, las alertas y la prueba de entrega. Usar secretos del Worker para `TURNSTILE_SECRET`, `RESEND_API_KEY` y `CONTACT_RATE_SECRET`. Confirmar los valores de `CONTACT_FROM` y `CONTACT_TO` en el servidor.
5. Autorizar por separado servicios de seguimiento externos o el envío del sitemap a herramientas de búsqueda. El artefacto funciona sin estas integraciones.

## Crear y comprobar el artefacto

En Linux con GNU tar, Git, acceso al registro npm y la versión de Node de `.node-version`, usa un checkout limpio en el commit a comprobar.

```sh
npm run release -- preview
npm run release -- production
```

Cada comando instala desde el lockfile, audita dependencias, compila, genera `_headers`, comprueba tipos y ejecuta las pruebas. Produce `releases/arkez-<perfil>-<commit>.tar.gz` y su `.sha256`. Conserva ambos con el commit completo y el identificador de despliegue cuando exista. Por defecto `npm run build` genera el perfil de prueba. El perfil de producción cambia metadatos, robots y reglas de alojamiento. El empaquetado carece de comandos de subida.

Antes de transferir el artefacto, comprueba la suma desde el directorio `releases/` con `sha256sum -c` y descomprime en un directorio vacío. Revisa que la raíz extraída contenga `index.html`, `404.html`, `robots.txt`, `sitemap.xml` y `_headers`. El archivo contiene la web estática. El Worker vive en `deployment/`.

## Publicar sólo tras las autorizaciones

1. Registra el proveedor web actual, zona DNS, estado DNSSEC y certificado. Exporta la zona completa y anota los valores de A/AAAA/CNAME, MX, SPF, DKIM, DMARC y registros de verificación. Guarda una copia de la versión web anterior y comprueba correo entrante y saliente.
2. Crea el proyecto aprobado de Cloudflare Pages Direct Upload. Usa la carpeta extraída del perfil `preview` en un despliegue de prueba con acceso controlado. Mantén la zona raíz en su proveedor hasta aprobar la homologación. Si se utiliza un subdominio, registra primero el dominio en Pages y después el CNAME.
3. Verifica TLS, las rutas del sitemap, 404, la redirección de HTTP, las cabeceras y la CSP en DevTools. Comprueba con un GET real que la previsualización entrega `X-Robots-Tag: noindex, nofollow`. Si aparece un error de CSP, identifica el recurso y corrige el build antes de repetir. Deshabilita transformaciones HTML o inyección de scripts que invaliden los hashes.
4. Carga **la carpeta extraída del artefacto de producción aprobado** como despliegue de producción. Mantén disponible el sitio anterior. Si se aprueba trasladar la zona raíz, replica toda la configuración, coordina DNSSEC con el registrador y activa el dominio canónico y la redirección aprobada de `www`. Completa la validación de certificados antes del cambio público. HSTS se aplica al dominio canónico sin `includeSubDomains` ni `preload`.
5. Tras el cambio, comprueba HTTPS, canonical, robots, todas las entradas del sitemap, Schema.org y 404 del dominio canónico. Verifica que el dominio canónico permita indexación y los hosts alternativos de Pages sigan fuera del índice. Repite la prueba de correo y registra el despliegue, la hora y el resultado.
6. Con la captación aún desactivada, la portada y la navegación quedan disponibles. La demo de contacto se prueba únicamente con el servidor local. La versión pública puede enlazar a un canal corporativo verificado si se autoriza antes de lanzar.

[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) · [Cabeceras de Pages](https://developers.cloudflare.com/pages/configuration/headers/) · [Dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Habilitar contacto con autorización separada

El [adaptador Worker](../deployment/contact-worker.mjs) tiene el modo `disabled` en [su configuración](../deployment/wrangler.toml). El frontend actual sólo usa la prueba local. La activación requiere cablear la variante de formulario real con la clave pública del widget Turnstile, actualizar CSP para sus orígenes oficiales, añadir el aviso aprobado y enviar al endpoint `POST /api/contacto` JSON con `name`, `email`, `service`, `message`, `privacyAccepted`, `website` vacío y `captcha`. Mantener el endpoint relativo y la misma procedencia.

Configura la ruta del Worker exclusivamente en `arkezinvest.com/api/contacto`, el límite de solicitudes y los secretos aprobados. Confirma que el criterio de acceso y retención cubre tanto Resend como el buzón. Usa datos ficticios y un entorno de homologación para una prueba integral aprobada. Configura en ese Worker separado su propio origen HTTPS exacto y credenciales de prueba. El modo `live` se activa sólo después de verificar los rechazos antispam y confirmar la entrega. El código no reintenta automáticamente peticiones al proveedor.

[Configuración de rutas de Workers](https://developers.cloudflare.com/workers/configuration/routing/routes/) · [CSP de Turnstile](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)

## Revertir

1. **Contacto.** Si aparecen envíos indebidos, fuga de datos o abuso, cambia `CONTACT_DELIVERY_MODE` a `disabled` o retira la ruta del Worker. Mantén separado el incidente de la reversión del sitio web. Revoca la clave del proveedor si hay indicios de exposición.
2. **Sitio.** Si fallan rutas, CSP, redirecciones o indexación, en Pages selecciona el último despliegue de producción íntegro y ejecuta **Rollback to this deployment**. Los despliegues de prueba no son objetivos de reversión. Si aún no existe uno apto, verifica el SHA-256 y vuelve a cargar el artefacto anterior validado o restaura la versión en el proveedor anterior. Conserva TLS válido durante la transición, incluso tras retirar HSTS de la configuración.
3. **DNS y correo.** Revierte DNS sólo si el problema está en el corte. Restaura los valores guardados y coordina nameservers y DS si cambiaron. No sustituyas registros de correo con valores genéricos. Comprueba propagación, HTTPS, recepción y entrega de correo.
4. Registra la causa y repite las pruebas de rutas, cabeceras, robots y correo antes de declarar terminada la reversión.

[Reversión de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)
