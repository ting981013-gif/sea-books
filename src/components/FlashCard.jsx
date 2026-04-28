import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { getExample } from '../utils/examples'
import { cleanDefinition } from '../utils/cleanText'
import { getTermImageUrl } from '../utils/illustration'

// Simple phonetic guesser for anatomy terms
function guessPhonetic(term) {
  if (!term) return ''
  const t = term.toLowerCase()
  const common = {
    'a': 'eɪ', 'e': 'ɛ', 'i': 'aɪ', 'o': 'oʊ', 'u': 'ju',
    'ph': 'f', 'ch': 'k', 'th': 'θ', 'sh': 'ʃ', 'gh': 'g',
  }
  let phonetic = '/'
  for (let i = 0; i < t.length && i < 12; i++) {
    const two = t.slice(i, i + 2)
    if (common[two]) { phonetic += common[two]; i++ }
    else if (common[t[i]]) phonetic += common[t[i]]
    else phonetic += t[i]
  }
  phonetic = phonetic.replace(/[()0-9\-]/g, '')
  return phonetic.slice(0, 16) + '/'
}

// AI-generated illustration with emoji fallback
function TermImage({ term, definition, type = 'front' }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const url = getTermImageUrl(term, definition, type)
  const isLarge = type === 'front'

  if (error) {
    return (
      <div className={`relative w-full flex items-center justify-center ${isLarge ? 'py-6' : 'py-3'}`}>
        <div className={`text-6xl ${isLarge ? '' : 'text-4xl'}`}>🧬</div>
      </div>
    )
  }

  return (
    <div className={`relative w-full flex items-center justify-center overflow-hidden ${isLarge ? 'py-2' : 'py-1'}`}>
      {!loaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${isLarge ? 'text-6xl' : 'text-4xl'}`}>
          🧬
        </div>
      )}
      <img
        src={url}
        alt={term}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`object-contain rounded-2xl transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          width: isLarge ? '100%' : '80%',
          maxHeight: isLarge ? 220 : 130,
        }}
        loading="lazy"
      />
    </div>
  )
}

// Speaker icon
const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Star icon
const StarIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Highlight term in example sentence
function highlightTerm(example, term) {
  if (!example || !term) return example
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = example.split(regex)
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span key={i} className="font-semibold" style={{ color: '#818cf8' }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function FlashCard({ term, onSwipeNext, onSwipePrev, isFavorite, onToggleFavorite, t }) {
  const [flipped, setFlipped] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.3, 1, 1, 1, 0.3])

  const handleDragEnd = (_, info) => {
    const threshold = 60
    if (info.offset.x < -threshold && info.velocity.x < -100) {
      animate(x, -300, { duration: 0.2 })
      setTimeout(() => {
        onSwipeNext?.()
        x.set(0)
        setFlipped(false)
      }, 200)
    } else if (info.offset.x > threshold && info.velocity.x > 100) {
      animate(x, 300, { duration: 0.2 })
      setTimeout(() => {
        onSwipePrev?.()
        x.set(0)
        setFlipped(false)
      }, 200)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
    }
  }

  const speak = (e) => {
    e.stopPropagation()
    if ('speechSynthesis' in window && term?.term) {
      const utter = new SpeechSynthesisUtterance(term.term)
      utter.lang = 'en-US'
      utter.rate = 0.8
      window.speechSynthesis.speak(utter)
    }
  }

  if (!term) return null

  const cleanedDef = cleanDefinition(term.definition)
  const phonetic = guessPhonetic(term.term)
  const example = getExample(term.term, cleanedDef)
  // Short definition for front side (first sentence or truncated)
  const shortDef = cleanedDef.split('.')[0] + (cleanedDef.includes('.') ? '.' : '')

  const cardBaseStyle = {
    background: '#ffffff',
    border: '1px solid rgba(226,232,255,0.25)',
    boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
    borderRadius: '32px',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-5 select-none"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
    >
      <div
        className="w-full max-w-sm relative"
        style={{ perspective: '1000px', height: '520px' }}
      >
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* FRONT */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            style={cardBaseStyle}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{
              rotateY: flipped ? 180 : 0,
              opacity: flipped ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="w-full h-full flex flex-col overflow-hidden rounded-[32px]">
              {/* Top header: term + star */}
              <div className="flex items-start justify-between px-6 pt-6 pb-2">
                <div className="flex-1">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[26px] font-bold text-indigo-950 leading-tight"
                  >
                    {term.term}
                  </motion.h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-[15px] text-indigo-400/70 font-medium"
                    >
                      {phonetic}
                    </motion.span>
                    <button
                      onClick={speak}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-indigo-400/50 hover:text-indigo-500 active:scale-90 transition-all"
                      style={{ background: 'rgba(99,102,241,0.08)' }}
                    >
                      <SpeakerIcon />
                    </button>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(term.term) }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-90 shrink-0"
                  style={{
                    background: '#f8f8ff',
                    color: isFavorite ? '#fbbf24' : '#c7d2fe',
                  }}
                >
                  <StarIcon filled={isFavorite} />
                </button>
              </div>

              {/* Center illustration */}
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <TermImage term={term.term} definition={cleanedDef} type="front" />
              </div>

              {/* Bottom short definition */}
              <div className="px-6 pb-6 pt-2">
                <p className="text-[14px] text-indigo-500/70 text-center leading-relaxed line-clamp-2">
                  {shortDef}
                </p>
              </div>
            </div>
          </motion.div>

          {/* BACK */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            style={cardBaseStyle}
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{
              rotateY: flipped ? 0 : 180,
              opacity: flipped ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="w-full h-full flex flex-col overflow-hidden rounded-[32px]">
              {/* Top header: term + star */}
              <div className="flex items-start justify-between px-6 pt-6 pb-2">
                <div className="flex-1">
                  <h2 className="text-[22px] font-bold text-indigo-950 leading-tight">{term.term}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] text-indigo-400/70 font-medium">{phonetic}</span>
                    <button
                      onClick={speak}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-indigo-400/50 hover:text-indigo-500 active:scale-90 transition-all"
                      style={{ background: 'rgba(99,102,241,0.08)' }}
                    >
                      <SpeakerIcon />
                    </button>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(term.term) }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90 shrink-0"
                  style={{
                    background: '#f8f8ff',
                    color: isFavorite ? '#fbbf24' : '#c7d2fe',
                  }}
                >
                  <StarIcon filled={isFavorite} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-3">
                {/* Definition */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-indigo-500/70 uppercase tracking-[0.08em] mb-1.5">{t?.('definition') || 'Definition'}</div>
                  <p className="text-[15px] text-indigo-900/80 leading-relaxed">{cleanedDef}</p>
                </div>

                {/* Example */}
                {example && (
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-indigo-500/70 uppercase tracking-[0.08em] mb-1.5">{t?.('example') || 'Example'}</div>
                    <p className="text-[15px] leading-relaxed text-indigo-700/70">
                      {highlightTerm(example, term.term)}
                    </p>
                  </div>
                )}

                {/* Back illustration */}
                <div className="mb-4">
                  <TermImage term={term.term} definition={example || cleanedDef} type="back" />
                </div>

                {/* Topic / Chapters */}
                {term.chapters?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[11px] font-bold text-indigo-500/70 uppercase tracking-[0.08em] mb-1.5">Topic</div>
                    <div className="flex flex-wrap gap-1.5">
                      {term.chapters.map(ch => (
                        <span
                          key={ch}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          style={{
                            background: 'rgba(99,102,241,0.08)',
                            color: '#818cf8',
                          }}
                        >
                          Ch.{ch}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom flip hint */}
              <div className="px-6 pb-4 pt-1 text-center">
                <span className="text-[11px] text-indigo-300/40">{t?.('tapToFlip') || 'tap to flip'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
