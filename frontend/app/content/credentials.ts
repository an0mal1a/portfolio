/**
 * Studies and certificates. Names are the issuer's own (Spanish). `what` follows the
 * issuer's published syllabus; `note` is the owner's own opinion, in first person: the
 * owner reviews and edits it here. `verify` is only set when the issuer's page was opened and shows the
 * certificate: never add an unverified link. Documents live in public/certificates
 * (`<doc.file>-800.webp` and `-1600.webp`), taken from the issuer whenever possible.
 */
import type { ClientLogo } from './showcase'

type Localized = Record<'es' | 'en', string>

export interface Credential {
  id: string
  name: string
  issuer: string
  /** ISO date of issue, or the years of a degree. */
  date: string
  hours?: number
  credentialId?: string
  verify?: string
  doc?: { file: string, width: number, height: number }
  what: Localized
  note: Localized
}

export const STUDIES: Credential[] = [
  {
    id: 'smr',
    name: 'Grado Medio en Sistemas Microinformáticos y Redes',
    issuer: 'IES Sa Colomina, Ibiza',
    date: '2022–2024',
    what: {
      es: 'Montaje y mantenimiento de equipos, sistemas operativos, redes locales, servicios en red, seguridad y aplicaciones web. Las prácticas las hice en el Ayuntamiento de Eivissa, de febrero a junio de 2024: mantenimiento de sus sistemas, mejoras en páginas del portal municipal y una auditoría de seguridad de sus equipos Windows.',
      en: 'Building and maintaining computers, operating systems, local networks, network services, security and web applications. I did my internship at Ibiza Town Council from February to June 2024: maintaining its systems, improving pages of the municipal portal and auditing the security of its Windows machines.',
    },
    note: {
      es: 'Me enseñó que debajo de cada aplicación hay una máquina, una red y alguien que la mantiene. Por eso también despliego y mantengo lo que programo.',
      en: 'It taught me that under every application there is a machine, a network and someone who looks after them. That is why I also deploy and maintain what I build.',
    },
  },
]

/** The first one is shown large; the rest follow newest first. */
export const CERTIFICATES: Credential[] = [
  {
    id: 'hacking',
    name: 'Introducción al Hacking',
    issuer: 'Hack4u',
    date: '2024-03-31',
    hours: 53,
    credentialId: '3017-0752-5399-2148',
    verify: 'https://hack4u.io/certificate/3017-0752-5399-2148',
    doc: { file: 'introduccion-al-hacking', width: 1600, height: 1067 },
    what: {
      es: 'Redes y reconocimiento, laboratorios propios en Docker, las vulnerabilidades web del OWASP Top 10 una a una, escalada de privilegios, buffer overflow y máquinas resueltas de principio a fin. Termina con un examen y con cómo se redacta un informe.',
      en: 'Networks and reconnaissance, home-made Docker labs, the OWASP Top 10 web vulnerabilities one by one, privilege escalation, buffer overflow and machines solved end to end. It closes with an exam and with how to write a report.',
    },
    note: {
      es: 'Es el que más cambió mi forma de programar. Cuando has explotado tú mismo una inyección o un control de acceso roto, ya no vuelves a escribir igual una consulta ni un endpoint.',
      en: 'This is the one that changed how I write code the most. Once you have exploited an injection or a broken access control yourself, you never write a query or an endpoint the same way again.',
    },
  },
  {
    id: 'rustlings',
    name: 'Fundamentos de Rust',
    issuer: 'Rustlang en Español',
    date: '2026-04-19',
    credentialId: 'd16b2b57-888e-4551-97f2-3c11bca4b828',
    verify: 'https://rustlings.rustlang-es.org/es/verificar/d16b2b57-888e-4551-97f2-3c11bca4b828',
    doc: { file: 'fundamentos-de-rust', width: 900, height: 636 },
    what: {
      es: 'Doce módulos con ejercicios en el navegador, del primer println! a las colecciones y los módulos, corrigiendo errores del compilador de verdad.',
      en: 'Twelve modules with exercises in the browser, from the first println! to collections and modules, fixing errors from the real compiler.',
    },
    note: {
      es: 'El compilador de Rust no te deja pasar una. Menos de un mes después empecé mi primer repositorio público en Rust, y hoy la API de esta web está escrita en él.',
      en: 'The Rust compiler lets nothing slide. Less than a month later I started my first public Rust repository, and today the API behind this site is written in it.',
    },
  },
  {
    id: 'python-ofensivo',
    name: 'Python Ofensivo',
    issuer: 'Hack4u',
    date: '2025-05-06',
    hours: 35,
    credentialId: '4762-9875-4377-9266',
    verify: 'https://hack4u.io/certificate/4762-9875-4377-9266',
    doc: { file: 'python-ofensivo', width: 1600, height: 1067 },
    what: {
      es: 'Python desde la base hasta programar herramientas propias: escáneres de puertos y de red, analizadores de tráfico y un chat con cifrado de extremo a extremo.',
      en: 'Python from the ground up to writing your own tools: port and network scanners, traffic analysers and a chat with end-to-end encryption.',
    },
    note: {
      es: 'Te enseña una metodología de desarrollo muy buena, tanto para temas ofensivos como para programar sin más, desde el inicio hasta los sockets, los hilos y el tráfico visto por dentro: es lo que hay debajo de cualquier integración.',
      en: 'It teaches you a very good development methodology for both offensive topics and basic programming, from the very beginning all the way to sockets, threads, and an inside look at network traffic: that\'s what lies beneath any integration.',
    },
  },
  {
    id: 'linux',
    name: 'Personalización de entorno en Linux',
    issuer: 'Hack4u',
    date: '2024-04-20',
    credentialId: '4855-1391-5292-5368',
    verify: 'https://hack4u.io/certificate/4855-1391-5292-5368',
    doc: { file: 'personalizacion-linux', width: 1600, height: 1067 },
    what: {
      es: 'Un entorno de trabajo montado pieza a pieza sobre Parrot: bspwm, sxhkd, Polybar, Picom, Kitty, Zsh y Neovim.',
      en: 'A working environment built piece by piece on Parrot: bspwm, sxhkd, Polybar, Picom, Kitty, Zsh and Neovim.',
    },
    note: {
      es: 'Parece un curso de estética y es de productividad. Configurar cada pieza a mano es la mejor forma de entender el sistema que usas.',
      en: 'It looks like a course about looks and it is about productivity. Setting up every piece by hand is the best way to understand the system you use.',
    },
  },
  {
    id: 'hacking-etico',
    name: 'Introducción al Hacking Ético',
    issuer: 'Mastermind',
    date: '2023-08-14',
    hours: 8,
    credentialId: '62d273a8032b4740960075d6e4d3c0a7',
    verify: 'https://mastermind.ac/certificado/62d273a8032b4740960075d6e4d3c0a7',
    doc: { file: 'introduccion-al-hacking-etico', width: 1600, height: 1131 },
    what: {
      es: 'Usuarios y permisos en Linux, fundamentos de pentesting, descubrimiento de servicios en red, captura de tráfico con Wireshark y protección de un servidor frente a las vulnerabilidades más conocidas.',
      en: 'Users and permissions in Linux, pentesting basics, discovering services on a network, capturing traffic with Wireshark and protecting a server from the best-known vulnerabilities.',
    },
    note: {
      es: 'Me gustó que cada ataque viniera con su defensa. Es como sigo pensando la seguridad. (El curso ya tiene sus años y hoy está algo desactualizado.)',
      en: 'I liked that every attack came with its defence. It is still how I think about security. (The course is a few years old and somewhat outdated today.)',
    },
  },
  {
    id: 'python',
    name: 'Aprende a programar con Python',
    issuer: 'Mastermind',
    date: '2023-03-20',
    hours: 12,
    credentialId: '3ec2d728b3e4405693ce99426e9d80ba',
    verify: 'https://mastermind.ac/certificado/3ec2d728b3e4405693ce99426e9d80ba',
    doc: { file: 'aprende-python', width: 1600, height: 1131 },
    what: {
      es: 'Programar desde cero: variables, control de flujo, funciones, interfaces gráficas y problemas reales.',
      en: 'Programming from scratch: variables, control flow, functions, graphical interfaces and real problems.',
    },
    note: {
      es: 'Por aquí empecé con Python, y le tengo un cariño enorme: para mí es el curso de oro. La línea de aprendizaje es increíble y todo es interactivo, con ejercicios en cada capítulo y un examen por módulo. Y, sobre todo, está Nate Gentile, que lo explica de una forma asombrosa. Tres semanas después subí a GitHub un escáner de puertos, servicios y vulnerabilidades sin necesidad de nmap (mas o menos), el repositorio público más antiguo que conservo.',
      en: 'This is where I started with Python, and I am hugely fond of it: to me it is the gold-standard course. The learning path is incredible and everything is interactive, with exercises in every chapter and an exam per module. And above all there is Nate Gentile, who explains things amazingly well. Three weeks later I pushed a port scanner to GitHub, the oldest public repository I still keep.',
    },
  },
  {
    id: 'red',
    name: 'Cómo protegerse en la red',
    issuer: 'Mastermind',
    date: '2023-02-02',
    hours: 8,
    credentialId: '9cd13b6c286149f4932555a242111c22',
    verify: 'https://mastermind.ac/certificado/9cd13b6c286149f4932555a242111c22',
    doc: { file: 'protegerse-en-la-red', width: 1600, height: 1131 },
    what: {
      es: 'Contraseñas, antivirus, navegación segura, redes WiFi, los ciberataques más comunes e ingeniería social.',
      en: 'Passwords, antivirus, safe browsing, WiFi networks, the most common cyberattacks and social engineering.',
    },
    note: {
      es: 'Un curso básico, muy de iniciación. Mi primer certificado: antes de atacar nada, entender de qué hay que protegerse. Ese mismo año empecé SecurEntry, un gestor de contraseñas en Python.',
      en: 'A basic course, very much for beginners. My first certificate: before attacking anything, understand what you need protecting from. That same year I started SecurEntry, a password manager in Python.',
    },
  },
]

/** Owner's CV, published without the phone number. */
export const CV_URL = '/cv/pablo-diez-cv.pdf'

/** Issuers' marks for the hero, in the site's ink. `scale` evens out their optical size. */
export const ISSUERS: readonly { name: string, logo: ClientLogo, scale: number }[] = [
  { name: 'Hack4u', logo: { src: '/logos/hack4u.webp', width: 392, height: 96 }, scale: 1 },
  { name: 'Mastermind', logo: { src: '/logos/mastermind.webp', width: 751, height: 96 }, scale: 0.62 },
  { name: 'Rustlang en Español', logo: { src: '/logos/rustlang-es.webp', width: 160, height: 96 }, scale: 1 },
]
