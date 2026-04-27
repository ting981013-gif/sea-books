import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import glossary from '../data/glossary'
import chapters from '../data/chapters'
import { cleanDefinition } from '../utils/cleanText'
import { getExample } from '../utils/examples'

const ANATOMY_EMOJIS = ['🧬', '🫀', '🦴', '🧠', '🫁', '🦷', '👁️', '💪', '🔬', '🧪', '💉', '🩺']

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

function getEmoji(term) {
  const t = term.toLowerCase()
  if (t.includes('heart') || t.includes('cardiac')) return '🫀'
  if (t.includes('brain') || t.includes('cerebr')) return '🧠'
  if (t.includes('bone') || t.includes('skelet') || t.includes('femur') || t.includes('skull')) return '🦴'
  if (t.includes('muscle') || t.includes('muscul')) return '💪'
  if (t.includes('lung') || t.includes('respirat') || t.includes('pulmon')) return '🫁'
  if (t.includes('eye') || t.includes('visual') || t.includes('retina')) return '👁️'
  if (t.includes('nerve') || t.includes('neural') || t.includes('spinal')) return '🔗'
  if (t.includes('blood') || t.includes('hem') || t.includes('arter') || t.includes('vein')) return '🩸'
  if (t.includes('skin') || t.includes('epiderm') || t.includes('derm')) return '🧴'
  return ANATOMY_EMOJIS[Math.abs(hashCode(term)) % ANATOMY_EMOJIS.length]
}

// Speaker icon
const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

function guessPhonetic(term) {
  if (!term) return ''
  const t = term.toLowerCase().replace(/[()0-9\-]/g, '')
  return '/' + t.slice(0, 14) + '/'
}

export default function TermDetail() {
  const { termId } = useParams()
  const navigate = useNavigate()
  const term = glossary.find(g => g.term === decodeURIComponent(termId))

  const speak = () => {
    if ('speechSynthesis' in window && term?.term) {
      const utter = new SpeechSynthesisUtterance(term.term)
      utter.lang = 'en-US'
      utter.rate = 0.8
      window.speechSynthesis.speak(utter)
    }
  }

  if (!term) {
    return (
      <div className="px-5 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="text-indigo-400/60 text-sm">Term not found</p>
      </div>
    )
  }

  const chapterNames = (term.chapters || []).map(ch => chapters.find(c => c.id === ch)).filter(Boolean)

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-indigo-950">Word Detail</h1>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[28px] p-6 mb-4 overflow-hidden relative"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        <div className="text-6xl mb-4 text-center">{getEmoji(term.term)}</div>

        <div className="flex items-center justify-center gap-3 mb-1">
          <h2 className="text-2xl font-bold text-indigo-950">{term.term}</h2>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-[14px] text-indigo-400/60 font-medium">{guessPhonetic(term.term)}</span>
          <button
            onClick={speak}
            className="w-7 h-7 rounded-full flex items-center justify-center text-indigo-400/50 hover:text-indigo-500 active:scale-90 transition-all"
            style={{ background: 'rgba(99,102,241,0.08)' }}
          >
            <SpeakerIcon />
          </button>
        </div>

        <div className="mb-5">
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-2">Definition</div>
          <p className="text-[15px] text-indigo-800/80 leading-relaxed">{cleanDefinition(term.definition)}</p>
        </div>

        <div className="mb-5">
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-2">Example</div>
          <p className="text-[15px] leading-relaxed" style={{ color: '#6366f1cc' }}>
            {getExample(term.term, term.definition)}
          </p>
        </div>

        {chapterNames.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-2">Related Chapters</div>
            <div className="flex flex-wrap gap-1.5">
              {chapterNames.map(ch => (
                <span
                  key={ch.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    color: '#818cf8',
                  }}
                >
                  Ch.{ch.id} {ch.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
