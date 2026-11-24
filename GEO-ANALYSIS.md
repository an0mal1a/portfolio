# GEO / búsqueda con IA: impablo.dev (build local, noviembre de 2026)

Auditado sobre la build de producción en local (`npm run build` + `node .output/server/index.mjs`) antes de publicarla. Ninguna cifra de visibilidad real está medida: el sitio nuevo todavía no está en producción.

## Puntuación de preparación GEO: 74/100 (estimada, antes del lanzamiento)

| Criterio | Peso | Nota | Por qué |
| --- | --- | --- | --- |
| Citabilidad | 25 % | 17 | Cada página abre con una frase que define quién es y qué hace ("Soy Pablo Diez, desarrollador full-stack independiente…"); las landings tienen FAQ visible y ahora "Qué incluye". Faltan datos concretos citables (plazos, procesos medidos) que solo puede aportar el propietario. |
| Estructura | 20 % | 17 | H1 → H2 → H3 limpio en todas las páginas; las preguntas del FAQ ya son `h3`; listas de entregables y pasos. |
| Multimodal | 15 % | 11 | Capturas reales de proyectos, retrato, datos en vivo (laboratorio, pared de contribuciones). Sin vídeo. |
| Autoridad y marca | 20 % | 10 | Person + ProfessionalService con `@id` estable, pero `sameAs` solo enlaza GitHub. Sin LinkedIn, reseñas, ni menciones externas verificables. |
| Accesibilidad técnica | 20 % | 19 | SSR completo (el contenido está en el HTML sin JavaScript), robots abierto, sitemap con alternates ES/EN, canonical y hreflang correctos. |

## Plataformas

No medido con herramienta (el dominio aún sirve la web antigua). Preparación cualitativa:
- **Google AI Overviews / AI Mode:** depende de posicionar en orgánico. La base técnica está lista; el freno es la autoridad (enlaces y menciones locales).
- **ChatGPT / Perplexity:** citan entidades con presencia externa (Wikipedia, Reddit, LinkedIn). Hoy la entidad "Pablo Diez, desarrollador en Ibiza" solo tiene GitHub como señal externa.

## Acceso de rastreadores IA (`/robots.txt`)

`User-agent: * / Allow: /`. No hay reglas específicas, así que todos los bots que respetan robots.txt tienen acceso:

| Bot | Para qué sirve | Estado |
| --- | --- | --- |
| Googlebot | Google Search, AI Overviews y AI Mode | Permitido |
| OAI-SearchBot | Citas en ChatGPT Search | Permitido |
| Claude-SearchBot | Citas en las búsquedas de Claude | Permitido |
| PerplexityBot | Perplexity | Permitido |
| Applebot | Siri, Spotlight y Safari | Permitido |
| GPTBot | Entrenamiento de OpenAI | Permitido |
| ClaudeBot | Entrenamiento de Anthropic | Permitido |
| Google-Extended | Entrenamiento y grounding de Gemini/Vertex | Permitido |
| CCBot | Common Crawl (entrenamiento) | Permitido |
| Applebot-Extended | Entrenamiento de Apple Intelligence | Permitido |

Si el propietario no quiere que el sitio se use para entrenar modelos, puede bloquear solo los de entrenamiento (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Applebot-Extended`) sin perder visibilidad en buscadores.

## llms.txt

Añadido en `frontend/public/llms.txt`: descripción de la entidad, servicios, pruebas y contacto. Google confirma que no lo usa para posicionar; se deja por si lo leen otros sistemas, sin esperar efecto.

## Menciones de marca

Solo hay una señal verificable: GitHub (`sameAs`). No consta perfil de LinkedIn, ficha de Google Business Profile, ni menciones en Reddit o YouTube.

## Citabilidad por pasajes

- **Bien:** la entradilla de la home, el `lead` de cada landing, las respuestas del FAQ (autocontenidas, aunque cortas: de 19 a 46 palabras) y los entregables de "Qué incluye".
- **Mejorable:** las landings tienen entre 570 y 690 palabras y las respuestas del FAQ son breves. Para "diseño web ibiza" conviene un bloque de unas 150 palabras que responda "¿cuánto se tarda en hacer una web?" o "¿qué necesito darte para empezar?". Debe escribirlo el propietario con datos reales; no se ha inventado ninguno.

## Renderizado en servidor

Todo el contenido indexable (titulares, servicios, proyectos, FAQ, casos de estudio) llega en el HTML del servidor. Solo el estado del sistema del laboratorio es exclusivo del cliente, y es intencionado: es un dato en vivo.

## Los 5 cambios de mayor impacto

1. **Google Business Profile** como desarrollador web en Ibiza, con la misma dirección y teléfono que el sitio y enlace a la home. Es la mayor palanca para "diseño web ibiza" y para el pack local. *(Propietario.)*
2. **`sameAs` completo:** añadir LinkedIn y cualquier perfil profesional real al `definePerson` de `frontend/app/app.vue`. *(Dame las URLs y lo añado.)*
3. **Enlaces de clientes:** pedir a los clientes con web (Tierras de Ibiza, Post Producciones, NextLevelApps) un "Web por Pablo Diez" que enlace a `/diseno-web-ibiza`. *(Propietario.)*
4. **Un bloque de respuesta con datos propios** en cada landing (plazos habituales, cómo es la primera semana). Solo con datos verdaderos. *(Propietario escribe, yo maqueto.)*
5. **Dar de alta el sitio nuevo en Google Search Console y Bing Webmaster Tools**, enviar `sitemap_index.xml` el día del lanzamiento y activar IndexNow en Bing.

## Datos estructurados

Ya presentes:
- Person, ProfessionalService/LocalBusiness (`areaServed` Ibiza y España, idiomas), WebSite y WebPage.
- Service + BreadcrumbList en cada landing.
- CreativeWork + BreadcrumbList en cada caso de estudio.
- FAQPage, solo donde el FAQ es visible.
- ProfilePage en "Sobre mí" y ContactPage en "Contacto".

Pendiente: `sameAs` (LinkedIn); `telephone` y `geo` en ProfessionalService si el propietario quiere publicarlos.

## Cambios aplicados en esta pasada

- Las preguntas del FAQ pasan a ser `h3` dentro de `summary`, para que la estructura de preguntas se vea en el HTML.
- Nueva sección "Qué incluye" en las tres landings (ES/EN), con descripciones de servicio sin cifras ni resultados.
- La meta description de la home queda en 160 caracteres (antes, 178).
- Añadido `/llms.txt`.
- Las imágenes de Cloudinary se redimensionan en el CDN de Cloudinary, con `preconnect`: menos carga en el servidor y mejor LCP en las páginas de proyectos.
