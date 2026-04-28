import { useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import FlashCard from '../components/FlashCard'
import glossary from '../data/glossary'

const ANATOMY_EMOJIS = ['🧬', '🫀', '🦴', '🧠', '🫁', '🦷', '👁️', '💪', '🔬', '🧪', '💉', '🩺']

function getEmoji(term) {
  const t = term.toLowerCase()
  if (t.includes('heart') || t.includes('cardiac')) return '🫀'
  if (t.includes('brain') || t.includes('cerebr')) return '🧠'
  if (t.includes('bone') || t.includes('skelet') || t.includes('femur') || t.includes('skull')) return '🦴'
  if (t.includes('muscle') || t.includes('muscul')) return '💪'
  if (t.includes('lung') || t.includes('respirat') || t.includes('pulmon')) return '🫁'
  if (t.includes('kidney') || t.includes('urin') || t.includes('renal')) return '🫘'
  if (t.includes('eye') || t.includes('visual') || t.includes('retina')) return '👁️'
  if (t.includes('nerve') || t.includes('neural') || t.includes('spinal')) return '🔗'
  if (t.includes('blood') || t.includes('hem') || t.includes('arter') || t.includes('vein')) return '🩸'
  if (t.includes('skin') || t.includes('epiderm') || t.includes('derm')) return '🧴'
  if (t.includes('cell') || t.includes('tissue')) return '🔬'
  if (t.includes('hormon') || t.includes('endocrin')) return '⚗️'
  return ANATOMY_EMOJIS[Math.abs(hashCode(term)) % ANATOMY_EMOJIS.length]
}

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}

// Settings gear icon
const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

// Button icons matching reference image
const GotItIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const NotSureIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ForgotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export default function Learning({ store }) {
  const navigate = useNavigate()
  const { state, markTerm, toggleFavorite, t } = store
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState([])
  const answeredSet = useRef(new Set())
  const [queueVersion, setQueueVersion] = useState(0)

  // Get active vocabulary source: default glossary or custom book
  const activeVocab = useMemo(() => {
    if (state.currentBookId === 'a-and-p-glossary') return glossary
    const customBook = (state.customBooks || []).find(b => b.id === state.currentBookId)
    return customBook?.terms || glossary
  }, [state.currentBookId, state.customBooks])

  const todaysTerms = useMemo(() => {
    const { dailyGoal, memory, todayStudied } = state
    const studiedSet = new Set(todayStudied)
    let newPool = activeVocab.filter(t => !studiedSet.has(t.term) && !memory.gotIt.includes(t.term) && !memory.notSure.includes(t.term) && !memory.forgot.includes(t.term))
    newPool = shuffle(newPool)

    const reviewTerms = [
      ...activeVocab.filter(t => memory.notSure.includes(t.term)),
      ...activeVocab.filter(t => memory.forgot.includes(t.term)),
    ]
    const shuffledReview = shuffle(reviewTerms)

    const seen = new Set()
    const result = []
    for (const t of shuffledReview) {
      if (!seen.has(t.term)) {
        seen.add(t.term)
        result.push(t)
      }
    }
    for (const t of newPool) {
      if (!seen.has(t.term)) {
        seen.add(t.term)
        result.push(t)
      }
      if (result.length >= dailyGoal) break
    }

    return result.map(t => ({
      ...t,
      emoji: getEmoji(t.term),
    }))
  }, [state.dailyGoal, state.todayStudied.length, state.memory.gotIt.length, state.memory.notSure.length, state.memory.forgot.length, queueVersion, activeVocab])

  const currentTerm = todaysTerms[currentIndex]
  const favorites = state.favorites || []

  const handleMark = useCallback((category) => {
    if (!currentTerm) return
    answeredSet.current.add(currentTerm.term)
    markTerm(currentTerm.term, category)
    setCompleted(prev => [...prev, { term: currentTerm, category }])
    setCurrentIndex(i => i + 1)
  }, [currentTerm, markTerm])

  const handleSwipeNext = useCallback(() => {
    if (!currentTerm) return
    if (!answeredSet.current.has(currentTerm.term)) {
      todaysTerms.push({ ...currentTerm })
      setQueueVersion(v => v + 1)
    }
    setCurrentIndex(i => i + 1)
  }, [currentTerm, todaysTerms])

  const handleSwipePrev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1))
  }, [])

  const handleToggleFavorite = useCallback((termId) => {
    toggleFavorite(termId)
  }, [toggleFavorite])

  const studied = state.todayStudied.length
  const goal = state.dailyGoal
  const isDone = studied >= goal || currentIndex >= todaysTerms.length

  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pt-6 pb-3"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold text-indigo-950">{t('learningTitle')}</h1>
          <span className="text-[13px] font-semibold text-indigo-400/70">{studied}/{goal}</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 rounded-full h-2 overflow-hidden"
            style={{
              background: 'rgba(226,232,255,0.5)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #818cf8 0%, #a78bfa 50%, #818cf8 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (studied / goal) * 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Card area */}
      <div className="flex-1 relative">
        <div className="absolute inset-x-0 bottom-4" style={{ top: '16px' }}>
          {isDone ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-indigo-950 mb-2">{t('greatJob')}</h2>
              <p className="text-indigo-400/70 text-center text-sm">
                {t('completedGoal').replace('{{goal}}', goal)}
              </p>
              <div
                className="mt-6 rounded-[24px] p-5 w-full max-w-xs"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(226,232,255,0.25)',
                  boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
                }}
              >
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#34c759' }}>{completed.filter(c => c.category === 'gotIt').length}</div>
                    <div className="text-[11px] text-indigo-400/60 font-medium mt-0.5">{t('gotItBtn')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#ff9f0a' }}>{completed.filter(c => c.category === 'notSure').length}</div>
                    <div className="text-[11px] text-indigo-400/60 font-medium mt-0.5">{t('notSureBtn')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#ff3b30' }}>{completed.filter(c => c.category === 'forgot').length}</div>
                    <div className="text-[11px] text-indigo-400/60 font-medium mt-0.5">{t('forgotBtn')}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <FlashCard
                key={`${currentIndex}-${currentTerm?.term}`}
                term={currentTerm}
                onSwipeNext={handleSwipeNext}
                onSwipePrev={handleSwipePrev}
                isFavorite={favorites.includes(currentTerm?.term)}
                onToggleFavorite={handleToggleFavorite}
                t={t}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Swipe hint */}
      {!isDone && currentTerm && (
        <div className="flex items-center justify-center gap-2 text-indigo-300/50 text-xs mt-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t('swipeHint')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Feedback buttons */}
      {!isDone && currentTerm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-8 pt-1 flex gap-3"
        >
          <button
            onClick={() => handleMark('gotIt')}
            className="flex-1 py-3.5 rounded-[20px] font-bold text-[14px] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            style={{
              background: 'linear-gradient(135deg, #d9f7be 0%, #f6ffed 100%)',
              border: '1px solid #52c41a',
              color: '#52c41a',
              boxShadow: '0 2px 8px rgba(82,196,26,0.08)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <GotItIcon />
              <span>{t('gotItBtn')}</span>
            </div>
            <span className="text-[10px] font-medium opacity-70">{t('gotItSub')}</span>
          </button>
          <button
            onClick={() => handleMark('notSure')}
            className="flex-1 py-3.5 rounded-[20px] font-bold text-[14px] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            style={{
              background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
              border: '1px solid #ffa940',
              color: '#ffa940',
              boxShadow: '0 2px 8px rgba(255,169,64,0.08)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <NotSureIcon />
              <span>{t('notSureBtn')}</span>
            </div>
            <span className="text-[10px] font-medium opacity-70">{t('notSureSub')}</span>
          </button>
          <button
            onClick={() => handleMark('forgot')}
            className="flex-1 py-3.5 rounded-[20px] font-bold text-[14px] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
            style={{
              background: 'linear-gradient(135deg, #ffccc7 0%, #fff1f0 100%)',
              border: '1px solid #ff4d4f',
              color: '#ff4d4f',
              boxShadow: '0 2px 8px rgba(255,77,79,0.08)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <ForgotIcon />
              <span>{t('forgotBtn')}</span>
            </div>
            <span className="text-[10px] font-medium opacity-70">{t('forgotSub')}</span>
          </button>
        </motion.div>
      )}
    </div>
  )
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
