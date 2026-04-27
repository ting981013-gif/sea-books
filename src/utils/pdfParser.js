import * as pdfjsLib from 'pdfjs-dist'

// Use CDN worker for compatibility with Vite
const PDFJS_VERSION = pdfjsLib.version || '4.10.38'
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`

export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, useSystemFonts: true }).promise

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText
}

// Extract potential vocabulary terms from text
// Strategy: look for sentences that define terms, e.g. "Term — definition"
// or paragraphs where a bold/italic term is followed by explanation
export function extractTerms(text) {
  const terms = []
  const seen = new Set()

  // Pattern 1: "Term — definition" or "Term - definition"
  const dashPattern = /([A-Z][a-zA-Z\s\-]{2,50})\s*[—\-\–]\s*([^\n.]{10,300})/g
  let match
  while ((match = dashPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim().replace(/\s+/g, ' ')
    if (!seen.has(term.toLowerCase()) && term.length > 2 && definition.length > 10) {
      seen.add(term.toLowerCase())
      terms.push({ term, definition, chapters: [] })
    }
  }

  // Pattern 2: "Term (noun/adj/verb). Definition..."
  const posPattern = /([A-Z][a-zA-Z\s\-]{2,40})\s*\((noun|verb|adj|adjective|adv|adverb)\)\.?\s*([A-Z][^\n]{10,300})/g
  while ((match = posPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[3].trim().replace(/\s+/g, ' ')
    if (!seen.has(term.toLowerCase()) && definition.length > 10) {
      seen.add(term.toLowerCase())
      terms.push({ term, definition, chapters: [] })
    }
  }

  // Pattern 3: Numbered lists "1. Term - definition"
  const listPattern = /\d+\.\s+([A-Z][a-zA-Z\s\-]{2,40})\s*[—\-\–:]\s*([^\n.]{10,300})/g
  while ((match = listPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim().replace(/\s+/g, ' ')
    if (!seen.has(term.toLowerCase()) && definition.length > 10) {
      seen.add(term.toLowerCase())
      terms.push({ term, definition, chapters: [] })
    }
  }

  // Pattern 4: Fallback - paragraphs that start with a capitalized word sequence
  // followed by a longer explanation
  if (terms.length === 0) {
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 50)
    for (const para of paragraphs.slice(0, 100)) {
      const firstSentence = para.split('.')[0]
      if (firstSentence.length > 20 && firstSentence.length < 80) {
        const words = firstSentence.split(/\s+/)
        const possibleTerm = words.slice(0, Math.min(4, words.length)).join(' ')
        if (possibleTerm && !seen.has(possibleTerm.toLowerCase())) {
          seen.add(possibleTerm.toLowerCase())
          terms.push({
            term: possibleTerm,
            definition: para.slice(0, 200).trim(),
            chapters: [],
          })
        }
      }
    }
  }

  return terms.slice(0, 200) // limit to 200 terms
}
