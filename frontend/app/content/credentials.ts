/**
 * Studies and certificates, newest first inside each group. Names are the issuer's
 * own (Spanish). `verify` is only set when the issuer's page was opened and shows the
 * certificate: never add an unverified link.
 */
export interface Credential {
  id: string
  name: string
  issuer: string
  /** ISO date of issue, or the years of a degree. */
  date: string
  hours?: number
  credentialId?: string
  verify?: string
}

export const STUDIES: Credential[] = [
  { id: 'smr', name: 'Grado Medio en Sistemas Microinformáticos y Redes', issuer: 'IES Sa Colomina, Ibiza', date: '2022–2024' },
]

export const CERTIFICATES: Credential[] = [
  // The certificate prints a shortened ID; the verification page needs the whole one.
  { id: 'rustlings', name: 'Fundamentos de Rust', issuer: 'Rustlang en Español', date: '2026-04-19' },
  { id: 'python-ofensivo', name: 'Python Ofensivo', issuer: 'Hack4u', date: '2025-05-06', hours: 35, credentialId: '4762-9875-4377-9266', verify: 'https://hack4u.io/certificate/4762-9875-4377-9266' },
  { id: 'hacking', name: 'Introducción al Hacking', issuer: 'Hack4u', date: '2024-03-31', hours: 53, credentialId: '3017-0752-5399-2148', verify: 'https://hack4u.io/certificate/3017-0752-5399-2148' },
  // The ID on this PDF (1598-2261-2760-4198) is no longer found on hack4u.io.
  { id: 'linux', name: 'Personalización de entorno en Linux', issuer: 'Hack4u', date: '2023-08-31' },
  { id: 'hacking-etico', name: 'Introducción al Hacking Ético', issuer: 'Mastermind', date: '2023-08-14', hours: 8, credentialId: '62d273a8032b4740960075d6e4d3c0a7', verify: 'https://mastermind.ac/certificado/62d273a8032b4740960075d6e4d3c0a7' },
  { id: 'python', name: 'Aprende a programar con Python', issuer: 'Mastermind', date: '2023-03-20', credentialId: '3ec2d728b3e4405693ce99426e9d80ba', verify: 'https://mastermind.ac/certificado/3ec2d728b3e4405693ce99426e9d80ba' },
  { id: 'red', name: 'Cómo protegerse en la red', issuer: 'Mastermind', date: '2023-02-02', hours: 8, credentialId: '9cd13b6c286149f4932555a242111c22', verify: 'https://mastermind.ac/certificado/9cd13b6c286149f4932555a242111c22' },
]

/** Owner's CV, published without the phone number. */
export const CV_URL = '/cv/pablo-diez-cv.pdf'
