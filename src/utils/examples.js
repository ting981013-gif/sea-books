import { cleanDefinition } from './cleanText'

// Generate example sentences for anatomy/medical terms
// Returns an example sentence based on term and definition

const TEMPLATES = {
  heart: 'The {term} pumps blood throughout the entire body, supplying oxygen to all tissues.',
  cardiac: 'Cardiac muscle tissue forms the walls of the {term}, enabling rhythmic contractions.',
  brain: 'The {term} controls all voluntary and involuntary activities of the body.',
  nerve: 'A {term} carries electrical impulses between the brain and other body parts.',
  muscle: 'The {term} contracts to produce movement at the joint.',
  bone: 'The {term} provides structural support and protects internal organs.',
  lung: 'The {term} facilitates gas exchange, allowing oxygen to enter the bloodstream.',
  blood: 'The {term} transports nutrients, oxygen, and waste products throughout the body.',
  skin: 'The {term} serves as the body\'s first line of defense against pathogens.',
  eye: 'The {term} converts light into neural signals that the brain interprets as vision.',
  hormone: 'The {term} is a chemical messenger that regulates various physiological processes.',
  cell: 'Every {term} contains genetic material and performs specialized functions.',
  artery: 'The {term} carries oxygenated blood away from the heart to the tissues.',
  vein: 'The {term} returns deoxygenated blood back to the heart.',
  kidney: 'The {term} filters waste products from the blood to form urine.',
  liver: 'The {term} detoxifies chemicals and metabolizes drugs in the body.',
  stomach: 'The {term} breaks down food using acid and enzymes during digestion.',
  intestine: 'The {term} absorbs nutrients from digested food into the bloodstream.',
  skeleton: 'The {term} provides the framework that supports and protects the body.',
  joint: 'The {term} allows smooth movement between adjacent bones.',
  tendon: 'The {term} connects muscle to bone, transmitting force during contraction.',
  ligament: 'The {term} connects bone to bone, providing joint stability.',
  cartilage: 'The {term} cushions joints and reduces friction during movement.',
  default: 'The {term} is essential for understanding human anatomy and physiology.',
}

export function getExample(term, definition) {
  if (!term || !definition) return ''
  const t = term.toLowerCase()

  // Find matching template
  for (const [key, template] of Object.entries(TEMPLATES)) {
    if (t.includes(key)) {
      return template.replace(/{term}/g, term)
    }
  }

  // Generate from cleaned definition
  const def = cleanDefinition(definition)
  const defStart = def.charAt(0).toLowerCase() + def.slice(1)

  // Try to make a natural sentence
  if (defStart.startsWith('a ') || defStart.startsWith('an ')) {
    return `In anatomy, ${term} is ${defStart}.`
  }
  if (defStart.startsWith('the ')) {
    return `${term} refers to ${defStart}.`
  }

  const variations = [
    `The ${term} is defined as ${defStart}.`,
    `In medical terminology, ${term} refers to ${defStart}.`,
    `Understanding the ${term} helps clinicians ${defStart}.`,
    `The ${term} plays an important role in ${defStart}.`,
  ]

  // Deterministic selection based on term length
  return variations[term.length % variations.length]
}
