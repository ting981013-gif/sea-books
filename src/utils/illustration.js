export function getTermImageUrl(term, definition, type = 'front') {
  const shortDef = (definition || '').split('.')[0].slice(0, 120)
  const prompt = type === 'front'
    ? `cute cartoon illustration depicting "${term}": ${shortDef}, educational children's book style, simple flat design, pastel colors, clean composition, white background, high quality`
    : `cute cartoon scene showing "${term}" in context: ${shortDef}, educational children's book style, simple flat design, pastel colors, clean composition, white background`

  const seed = term.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + (type === 'back' ? 12345 : 0)
  const encoded = encodeURIComponent(prompt)
  const width = type === 'front' ? 400 : 320
  const height = type === 'front' ? 320 : 200

  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=false`
}
