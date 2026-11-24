export interface Chapter { id: string, title: string, html: string }

const text = (html: string) => html
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .trim()

const anchor = (title: string) => title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

/**
 * Splits an authored case study into its h2 chapters. Text before the first heading
 * stays in a chapter without a title; markup is otherwise untouched.
 */
export function toChapters(html: string): Chapter[] {
  const body = html.trim().replace(/^<div[^>]*>([\s\S]*)<\/div>$/i, '$1')
  const parts = body.split(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
  const chapters: Chapter[] = []
  if (parts[0]?.trim()) chapters.push({ id: 'caso', title: '', html: parts[0] })
  for (let i = 1; i < parts.length; i += 2) {
    const title = text(parts[i] ?? '')
    chapters.push({ id: anchor(title) || `capitulo-${i}`, title, html: parts[i + 1] ?? '' })
  }
  return chapters
}
