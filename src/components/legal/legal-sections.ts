/*
 * The legal copy in src/lib/content.ts is shaped { title, content } with no
 * anchor ids. The pages keep reading that file unchanged; this adapter gives
 * each clause the id the ledger needs for its anchor.
 */

export interface LegalSourceSection {
  title: string
  content: string
}

export interface LegalSection {
  id: string
  title: string
  body: string
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toLegalSections(
  sections: readonly LegalSourceSection[],
): LegalSection[] {
  return sections.map((section) => ({
    id: slugify(section.title),
    title: section.title,
    body: section.content,
  }))
}
