import type { ProjectType } from '#shared/types/api'

export type ServiceId = 'web-design' | 'custom-software' | 'ai-automation'
type Locale = 'es' | 'en'

export interface ServiceContent {
  id: ServiceId
  projectTypes: ProjectType[]
  /** Projects of another type that also prove this service. */
  alsoSlugs?: string[]
  /** Short name used in the home index and nav. */
  name: string
  /** One sentence for the home index row. */
  pitch: string
  /** Mono list of what is included. */
  includes: string[]
  /** What the service delivers, one short claim each (no prices, no results). */
  deliverables: { title: string, body: string }[]
  seo: { title: string, description: string }
  h1: string
  lead: string
  /** Who this is for, in their words. */
  forWhom: { title: string, body: string }[]
  /** How the work goes, step by step. */
  steps: { title: string, body: string }[]
  faq: { q: string, a: string }[]
  workTitle: string
  /** Project to lead the landing with, when it has an image. */
  heroSlug?: string
}

const es: Record<ServiceId, ServiceContent> = {
  'web-design': {
    id: 'web-design',
    projectTypes: ['web'],
    heroSlug: 'tierradeibiza-web',
    name: 'Diseño web en Ibiza',
    pitch: 'Webs rápidas y claras que explican lo que haces y convierten visitas en contactos.',
    includes: ['Diseño a medida', 'Nuxt / Vue', 'SEO local', 'Formularios y reservas', 'ES / EN'],
    deliverables: [
      { title: 'Diseño a medida', body: 'Sin plantillas ni constructores: la estructura sale de tu negocio y de lo que buscan tus clientes, y el diseño, de tu marca.' },
      { title: 'Rápida en el móvil', body: 'Páginas renderizadas en servidor, imágenes optimizadas y el mínimo JavaScript, para que cargue rápido también con datos móviles.' },
      { title: 'SEO local desde el primer día', body: 'Títulos, descripciones, datos estructurados y alta en Google Search Console, con cada servicio en su propia página.' },
      { title: 'Formularios que llegan', body: 'Contacto, presupuestos o reservas que llegan a tu email o a tu sistema, con protección contra spam.' },
      { title: 'Español e inglés de verdad', body: 'Cada idioma con sus propias URLs y textos escritos para su público, no traducidos a máquina.' },
    ],
    seo: {
      title: 'Diseño web en Ibiza | Webs a medida que traen clientes',
      description: 'Diseño y desarrollo web a medida en Ibiza: webs rápidas, bilingües y pensadas para Google y para convertir visitas en clientes. Pablo Diez, desarrollador independiente.',
    },
    h1: 'Diseño web en Ibiza, hecho a medida y pensado para traer clientes.',
    lead: 'Diseño y programo la web de tu negocio desde cero: sin plantillas ni constructores, rápida en el móvil, en español e inglés y preparada para que te encuentren en Google cuando alguien busca lo que haces en la isla.',
    forWhom: [
      { title: 'Negocios locales que quieren dejar de depender del boca a boca', body: 'Una web que explica bien qué ofreces, dónde estás y cómo contactarte, y que aparece cuando te buscan en Ibiza.' },
      { title: 'Empresas internacionales con clientes en la isla', body: 'Webs bilingües de verdad, con cada idioma escrito para su público y no traducido a máquina.' },
      { title: 'Webs que ya tienes pero no funcionan', body: 'Lentas, imposibles de editar o invisibles en Google. Empezamos por medir qué falla y lo rehacemos con criterio.' },
    ],
    steps: [
      { title: 'Conversación', body: 'Entiendo tu negocio, a quién quieres llegar y qué debe pasar cuando alguien entra en la web.' },
      { title: 'Estructura y diseño', body: 'Defino las páginas según lo que busca tu cliente en Google y diseño una identidad visual propia para ellas.' },
      { title: 'Desarrollo', body: 'Programo la web con Nuxt: carga rápida, accesible, con formularios que llegan y datos estructurados para buscadores.' },
      { title: 'Publicación y medición', body: 'Publico, conecto Google Search Console y reviso que se indexe y que los contactos lleguen.' },
    ],
    faq: [
      { q: '¿Usas WordPress o plantillas?', a: 'No. Programo cada web a medida con Nuxt (Vue). Así la web carga rápido, no arrastra plugins que mantener y el diseño es solo tuyo.' },
      { q: '¿La web estará en español e inglés?', a: 'Si tu público lo necesita, sí. Cada idioma tiene sus propias URLs y textos pensados para quien lo lee, que es también lo que Google premia.' },
      { q: '¿Me ayudas a aparecer en Google en Ibiza?', a: 'La web sale preparada para SEO local: estructura por servicios, datos estructurados, velocidad y textos que responden a lo que se busca. El posicionamiento lleva tiempo y depende también de tu ficha de Google y de tu competencia; te explico qué puedo controlar y qué no.' },
    ],
    workTitle: 'Webs que he diseñado y programado',
  },
  'custom-software': {
    id: 'custom-software',
    projectTypes: ['saas', 'tool'],
    name: 'Software a medida',
    pitch: 'CRMs, paneles y plataformas que se adaptan a cómo trabaja tu equipo, no al revés.',
    includes: ['CRM a medida', 'Paneles internos', 'APIs', 'PostgreSQL', 'Rust / Python'],
    deliverables: [
      { title: 'Modelo de datos primero', body: 'Antes de las pantallas, defino qué datos hay, quién puede verlos y cómo se relacionan. Es lo que hace que el sistema aguante.' },
      { title: 'CRM y paneles a medida', body: 'Clientes, operaciones, agenda o inventario organizados como trabaja tu equipo, no como dicta una herramienta genérica.' },
      { title: 'APIs e integraciones', body: 'Conecto tu sistema con las herramientas que ya usas: email, WhatsApp, pasarelas de pago o servicios externos.' },
      { title: 'Permisos y seguridad', body: 'Roles y accesos definidos en el servidor, validación de cada dato y límites de peticiones en cada punto público.' },
      { title: 'Puesta en producción', body: 'Despliegue con Docker y entrega continua, y sigo disponible para cambios y mejoras cuando el negocio los pida.' },
    ],
    seo: {
      title: 'Desarrollo de software a medida | CRM y plataformas a medida',
      description: 'Desarrollo de software a medida desde Ibiza: CRMs, paneles internos, APIs y plataformas SaaS construidas de principio a fin, con la seguridad pensada desde el diseño.',
    },
    h1: 'Software a medida para que tu negocio funcione como tú trabajas.',
    lead: 'Cuando las hojas de cálculo y las herramientas genéricas se quedan cortas, construyo el sistema que necesitas: un CRM, un panel de operaciones o una plataforma completa, de la base de datos a la interfaz.',
    forWhom: [
      { title: 'Equipos que trabajan con diez herramientas que no se hablan', body: 'Centralizo datos, procesos y permisos en un solo sistema hecho para tu flujo de trabajo.' },
      { title: 'Empresas que necesitan un CRM a medida', body: 'Clientes, oportunidades, documentos y comunicaciones modelados como los usa tu equipo, no como los impone un SaaS genérico.' },
      { title: 'Fundadores con un producto que construir', body: 'De la idea a una primera versión en producción, con una arquitectura que aguante cuando el producto crezca.' },
    ],
    steps: [
      { title: 'Entender el proceso', body: 'Antes de programar, mapeo cómo trabaja tu equipo hoy y dónde se pierde tiempo o información.' },
      { title: 'Modelo de datos y arquitectura', body: 'Diseño la base de datos, los permisos y las integraciones. Es la parte que decide si el sistema escala.' },
      { title: 'Versiones cortas', body: 'Entrego por módulos que puedes usar pronto, en lugar de esperar meses a un sistema entero.' },
      { title: 'Producción', body: 'Despliegue con Docker, copias de seguridad, monitorización y la seguridad revisada antes de abrirlo al uso real.' },
    ],
    faq: [
      { q: '¿Por qué software a medida y no una herramienta existente?', a: 'Si una herramienta existente encaja, te lo diré. El software a medida compensa cuando tu proceso es tu ventaja, cuando pagas varias herramientas que no se integran o cuando necesitas control total sobre tus datos.' },
      { q: '¿Con qué tecnologías trabajas?', a: 'Nuxt y Vue en la interfaz; Rust (Axum) y Python (FastAPI) en el servidor; PostgreSQL y Redis para los datos; Docker para desplegar. Elijo según el problema, no por moda.' },
      { q: '¿El código es mío?', a: 'Lo acordamos por escrito antes de empezar. Lo habitual en un desarrollo a medida es que el cliente tenga el código y la infraestructura a su nombre.' },
    ],
    workTitle: 'Plataformas y herramientas que he construido',
  },
  'ai-automation': {
    id: 'ai-automation',
    projectTypes: ['automation'],
    alsoSlugs: ['vestta'],
    name: 'Automatización con IA',
    pitch: 'Bots y flujos con IA que hacen el trabajo repetitivo por WhatsApp, correo o tu propio sistema.',
    includes: ['WhatsApp Business API', 'LLMs', 'Integraciones', 'Flujos y avisos'],
    deliverables: [
      { title: 'Bots de WhatsApp', body: 'Asistentes sobre la WhatsApp Business API para turnos, solicitudes o atención, conectados a tus datos reales.' },
      { title: 'IA con límites claros', body: 'El modelo de lenguaje clasifica, resume o redacta dentro de reglas definidas; las decisiones importantes siguen siendo de una persona.' },
      { title: 'Integraciones sin copiar a mano', body: 'Flujos que mueven datos entre email, hojas de cálculo, tu CRM o cualquier sistema con API.' },
      { title: 'Avisos y registro', body: 'Notificaciones cuando algo necesita atención y un registro de lo que ha hecho cada automatización.' },
    ],
    seo: {
      title: 'Automatización con IA para empresas | Bots y flujos a medida',
      description: 'Automatización con IA para negocios: bots de WhatsApp, flujos con modelos de lenguaje e integraciones que eliminan trabajo repetitivo. Desarrollo a medida desde Ibiza.',
    },
    h1: 'Automatización con IA que quita trabajo repetitivo, no que lo añade.',
    lead: 'Conecto modelos de lenguaje con tus herramientas para que las tareas de siempre (turnos, avisos, respuestas, informes) se hagan solas por WhatsApp, por correo o dentro de tu propio sistema, con una persona al mando cuando hace falta.',
    forWhom: [
      { title: 'Equipos que gestionan personal por WhatsApp', body: 'Turnos, horas, incidencias y avisos ordenados sin cambiar la app que tu equipo ya usa.' },
      { title: 'Negocios que responden lo mismo cien veces', body: 'Respuestas y clasificación automáticas con IA, revisables y con límites claros sobre lo que el bot puede hacer.' },
      { title: 'Procesos con datos que se copian a mano', body: 'Integraciones entre tus herramientas para que la información se mueva sola y sin errores.' },
    ],
    steps: [
      { title: 'Elegir qué automatizar', body: 'Buscamos la tarea que más tiempo consume y donde un error cuesta poco. Ahí empieza la automatización.' },
      { title: 'Diseñar el flujo', body: 'Defino qué decide la IA, qué decide una regla fija y cuándo interviene una persona.' },
      { title: 'Construir e integrar', body: 'Programo el flujo y lo conecto con WhatsApp, tu correo o tu base de datos.' },
      { title: 'Medir y ajustar', body: 'Registro cada acción para poder revisar resultados y corregir el comportamiento con datos reales.' },
    ],
    faq: [
      { q: '¿La IA puede equivocarse?', a: 'Sí, y por eso diseño cada flujo con límites: la IA propone o clasifica, las acciones sensibles pasan por reglas o por una persona, y todo queda registrado para revisarlo.' },
      { q: '¿Qué pasa con los datos de mis clientes?', a: 'Envío a los modelos solo lo necesario, guardo los datos en tu infraestructura y documento qué proveedor procesa qué. Vengo de la seguridad: es lo primero que reviso.' },
      { q: '¿Funciona con WhatsApp?', a: 'Sí, con la API oficial de WhatsApp Business. Ya he construido un sistema de gestión de plantilla que funciona íntegramente por WhatsApp.' },
    ],
    workTitle: 'La automatización, dentro de un producto real',
  },
}

const en: Record<ServiceId, ServiceContent> = {
  'web-design': {
    id: 'web-design',
    projectTypes: ['web'],
    heroSlug: 'tierradeibiza-web',
    name: 'Web design in Ibiza',
    pitch: 'Fast, clear websites that explain what you do and turn visits into enquiries.',
    includes: ['Bespoke design', 'Nuxt / Vue', 'Local SEO', 'Forms and bookings', 'ES / EN'],
    deliverables: [
      { title: 'Bespoke design', body: 'No templates or site builders: the structure comes from your business and what your clients search for, the design from your brand.' },
      { title: 'Fast on mobile', body: 'Server-rendered pages, optimised images and minimal JavaScript, so it loads fast even on mobile data.' },
      { title: 'Local SEO from day one', body: 'Titles, descriptions, structured data and Google Search Console set up, with each service on its own page.' },
      { title: 'Forms that arrive', body: 'Contact, quote or booking forms that reach your inbox or your system, with spam protection.' },
      { title: 'Real English and Spanish', body: 'Each language with its own URLs and copy written for its audience, not machine-translated.' },
    ],
    seo: {
      title: 'Web design in Ibiza | Custom websites that bring clients',
      description: 'Custom web design and development in Ibiza: fast, bilingual websites built for Google and for turning visits into clients. Pablo Diez, independent developer.',
    },
    h1: 'Web design in Ibiza, custom-built to bring you clients.',
    lead: 'I design and code your business website from scratch: no templates or page builders, fast on mobile, in English and Spanish, and ready to be found on Google when someone on the island searches for what you do.',
    forWhom: [
      { title: 'Local businesses that want more than word of mouth', body: 'A website that clearly says what you offer, where you are and how to reach you, and shows up when people search in Ibiza.' },
      { title: 'International companies with clients on the island', body: 'Properly bilingual sites, with each language written for its audience rather than machine-translated.' },
      { title: 'Websites you already have that do not work', body: 'Slow, impossible to edit or invisible on Google. We start by measuring what fails, then rebuild it properly.' },
    ],
    steps: [
      { title: 'Conversation', body: 'I learn how your business works, who you want to reach and what should happen when someone lands on the site.' },
      { title: 'Structure and design', body: 'I plan the pages around what your clients search for and design a visual identity of their own.' },
      { title: 'Development', body: 'I build the site with Nuxt: fast, accessible, with forms that arrive and structured data for search engines.' },
      { title: 'Launch and measurement', body: 'I publish, connect Google Search Console and check that pages get indexed and enquiries arrive.' },
    ],
    faq: [
      { q: 'Do you use WordPress or templates?', a: 'No. I code every site with Nuxt (Vue). It loads fast, carries no plugins to maintain, and the design is yours alone.' },
      { q: 'Will the site be in English and Spanish?', a: 'If your audience needs it, yes. Each language gets its own URLs and copy written for its readers, which is also what Google rewards.' },
      { q: 'Will you help me rank on Google in Ibiza?', a: 'The site ships ready for local SEO: one page per service, structured data, speed and copy that answers real searches. Ranking takes time and also depends on your Google Business Profile and your competitors; I will tell you what I can and cannot control.' },
    ],
    workTitle: 'Websites I have designed and built',
  },
  'custom-software': {
    id: 'custom-software',
    projectTypes: ['saas', 'tool'],
    name: 'Custom software',
    pitch: 'CRMs, dashboards and platforms that fit how your team works, not the other way round.',
    includes: ['Custom CRM', 'Internal dashboards', 'APIs', 'PostgreSQL', 'Rust / Python'],
    deliverables: [
      { title: 'Data model first', body: 'Before any screen, I define what data exists, who can see it and how it connects. That is what makes a system hold up.' },
      { title: 'Custom CRM and dashboards', body: 'Clients, operations, scheduling or inventory organised the way your team works, not the way a generic tool dictates.' },
      { title: 'APIs and integrations', body: 'I connect your system to the tools you already use: email, WhatsApp, payment gateways or external services.' },
      { title: 'Permissions and security', body: 'Roles and access enforced on the server, every input validated and rate limits on every public endpoint.' },
      { title: 'Shipping to production', body: 'Deployed with Docker and continuous delivery, and I stay available for changes and improvements as the business needs them.' },
    ],
    seo: {
      title: 'Custom software development | Bespoke CRMs and platforms',
      description: 'Custom software development from Ibiza: CRMs, internal dashboards, APIs and SaaS platforms built end to end, with security designed in from the start.',
    },
    h1: 'Custom software so your business runs the way you work.',
    lead: 'When spreadsheets and generic tools fall short, I build the system you need: a CRM, an operations dashboard or a full platform, from the database to the interface.',
    forWhom: [
      { title: 'Teams juggling ten tools that do not talk to each other', body: 'I bring data, processes and permissions into one system built around your workflow.' },
      { title: 'Companies that need a custom CRM', body: 'Clients, deals, documents and messages modelled the way your team uses them, not the way a generic SaaS dictates.' },
      { title: 'Founders with a product to build', body: 'From idea to a first version in production, on an architecture that holds up as the product grows.' },
    ],
    steps: [
      { title: 'Understand the process', body: 'Before writing code, I map how your team works today and where time or information gets lost.' },
      { title: 'Data model and architecture', body: 'I design the database, permissions and integrations. This is what decides whether the system scales.' },
      { title: 'Short releases', body: 'I deliver module by module so you can use it early, instead of waiting months for a whole system.' },
      { title: 'Production', body: 'Docker deployment, backups, monitoring and a security review before it goes into real use.' },
    ],
    faq: [
      { q: 'Why custom software instead of an existing tool?', a: 'If an existing tool fits, I will say so. Custom software pays off when your process is your edge, when you pay for several tools that do not integrate, or when you need full control of your data.' },
      { q: 'Which technologies do you use?', a: 'Nuxt and Vue for interfaces; Rust (Axum) and Python (FastAPI) on the server; PostgreSQL and Redis for data; Docker to deploy. I choose for the problem, not for fashion.' },
      { q: 'Do I own the code?', a: 'We agree it in writing before starting. In custom development the client usually owns the code and the infrastructure.' },
    ],
    workTitle: 'Platforms and tools I have built',
  },
  'ai-automation': {
    id: 'ai-automation',
    projectTypes: ['automation'],
    alsoSlugs: ['vestta'],
    name: 'AI automation',
    pitch: 'AI bots and workflows that take repetitive work off your plate via WhatsApp, email or your own system.',
    includes: ['WhatsApp Business API', 'LLMs', 'Integrations', 'Workflows and alerts'],
    deliverables: [
      { title: 'WhatsApp bots', body: 'Assistants on the WhatsApp Business API for shifts, requests or customer replies, connected to your real data.' },
      { title: 'AI with clear limits', body: 'The language model classifies, summarises or drafts within defined rules; important decisions stay with a person.' },
      { title: 'Integrations, no copy-paste', body: 'Workflows that move data between email, spreadsheets, your CRM or any system with an API.' },
      { title: 'Alerts and a log', body: 'Notifications when something needs attention, and a record of what each automation has done.' },
    ],
    seo: {
      title: 'AI automation for businesses | Custom bots and workflows',
      description: 'AI automation for businesses: WhatsApp bots, language-model workflows and integrations that remove repetitive work. Custom development from Ibiza.',
    },
    h1: 'AI automation that removes repetitive work instead of adding it.',
    lead: 'I connect language models to your tools so the usual tasks (shifts, alerts, replies, reports) happen on their own over WhatsApp, email or inside your own system, with a person in charge when it matters.',
    forWhom: [
      { title: 'Teams managing staff over WhatsApp', body: 'Shifts, hours, incidents and alerts in order, without changing the app your team already uses.' },
      { title: 'Businesses answering the same question a hundred times', body: 'Automatic AI replies and triage, reviewable, with clear limits on what the bot can do.' },
      { title: 'Processes where data is copied by hand', body: 'Integrations between your tools so information moves by itself, without mistakes.' },
    ],
    steps: [
      { title: 'Choose what to automate', body: 'We find the task that eats the most time and where a mistake costs little. Automation starts there.' },
      { title: 'Design the flow', body: 'I define what the AI decides, what a fixed rule decides and when a person steps in.' },
      { title: 'Build and integrate', body: 'I code the flow and connect it to WhatsApp, your email or your database.' },
      { title: 'Measure and adjust', body: 'Every action is logged so results can be reviewed and behaviour corrected with real data.' },
    ],
    faq: [
      { q: 'Can the AI get things wrong?', a: 'Yes, which is why every flow has limits: the AI suggests or classifies, sensitive actions go through rules or a person, and everything is logged for review.' },
      { q: 'What about my customers\' data?', a: 'I send models only what they need, keep data on your infrastructure and document which provider processes what. I come from security: it is the first thing I check.' },
      { q: 'Does it work with WhatsApp?', a: 'Yes, through the official WhatsApp Business API. I have already built a staff-management system that runs entirely over WhatsApp.' },
    ],
    workTitle: 'Automation inside a real product',
  },
}

/**
 * Shipped work shown for each service in the home showcase: a real recording in
 * /public/media and the case study behind it.
 */
export interface ServiceWork { slug: string, name: string, media: string }

const SERVICE_WORK: Record<ServiceId, { slug: string, name: Record<Locale, string>, media: string }[]> = {
  'web-design': [
    { slug: 'tierradeibiza-web', name: { es: 'Tierras de Ibiza', en: 'Tierras de Ibiza' }, media: 'tierras' },
    { slug: 'postproducciones-web', name: { es: 'Post Producciones', en: 'Post Producciones' }, media: 'post' },
    { slug: 'lacasadesusana-web', name: { es: 'La Casa de Susana', en: 'La Casa de Susana' }, media: 'susana' },
    { slug: 'vestta-web', name: { es: 'Vestta.io', en: 'Vestta.io' }, media: 'vestta-web' },
  ],
  'custom-software': [
    { slug: 'vestta', name: { es: 'Vestta CRM', en: 'Vestta CRM' }, media: 'vestta-tour' },
    { slug: 'brisa-saas', name: { es: 'Brisa Operations', en: 'Brisa Operations' }, media: 'brisa' },
  ],
  'ai-automation': [
    { slug: 'vestta', name: { es: 'El agente de WhatsApp de Vestta', en: 'Vestta\'s WhatsApp agent' }, media: 'vestta-whatsapp' },
  ],
}

export function getServiceWork(id: ServiceId, locale: string): ServiceWork[] {
  const l: Locale = locale === 'en' ? 'en' : 'es'
  return SERVICE_WORK[id].map(w => ({ ...w, name: w.name[l] }))
}

export const SERVICE_IDS: ServiceId[] = ['web-design', 'custom-software', 'ai-automation']

export function getServices(locale: string): Record<ServiceId, ServiceContent> {
  return (locale as Locale) === 'en' ? en : es
}
