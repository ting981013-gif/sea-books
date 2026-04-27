// Clean glossary definition text by removing chapter numbers, page numbers,
// file metadata, dates, etc. that appear after the actual definition.

export function cleanDefinition(def) {
  if (!def) return ''
  let cleaned = def.trim()

  // Remove everything starting from parenthetical chapter references: (26) or (1, 2)
  cleaned = cleaned.replace(/\s*\(\d+(?:,\s*\d+)*\)[\s\S]*$/, '')

  // Remove trailing file metadata like: Z03_MART9867_11_GE_GLOS.indd
  cleaned = cleaned.replace(/\s+\d+\s+[A-Z][A-Z0-9_]*\.indd[\s\S]*$/i, '')

  // Remove trailing dates like: 07/09/17 1
  cleaned = cleaned.replace(/\s+\d{2}\/\d{2}\/\d{2}[\s\S]*$/i, '')

  // Remove trailing orphaned numbers
  cleaned = cleaned.replace(/\s+\d+\s*$/, '')

  return cleaned.trim()
}
