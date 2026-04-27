import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import glossary from '../data/glossary'

const categoryIcons = {
  gotIt: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  notSure: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  forgot: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  favorites: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const categoryColors = {
  gotIt: '#34c759',
  notSure: '#ff9f0a',
  forgot: '#ff3b30',
  favorites: '#fbbf24',
}

const categorySublabelKey = {
  gotIt: 'mastered',
  notSure: 'needReview',
  forgot: 'difficult',
  favorites: 'favoriteDesc',
}

const categoryLabelKey = {
  gotIt: 'gotIt',
  notSure: 'notSureBtn',
  forgot: 'forgotBtn',
  favorites: 'favorites',
}

export default function MemoryList({ store }) {
  const { category } = useParams()
  const navigate = useNavigate()
  const { t } = store
  const isFav = category === 'favorites'
  const color = categoryColors[category] || categoryColors.gotIt
  const terms = isFav ? (store.state.favorites || []) : (store.state.memory[category] || [])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())

  const termData = useMemo(() => {
    return terms
      .map(termId => glossary.find(g => g.term === termId))
      .filter(Boolean)
      .filter(t => !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()))
  }, [terms, search])

  const moveAll = (toCategory) => {
    selected.forEach(termId => {
      store.moveTerm(termId, category, toCategory)
    })
    setSelected(new Set())
  }

  const relearnAll = () => {
    selected.forEach(termId => {
      store.removeTermFromMemory(termId, category)
    })
    setSelected(new Set())
  }

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
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{
              color,
              background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
              border: `1px solid ${color}30`,
            }}
          >
            {categoryIcons[category] || categoryIcons.gotIt}
          </div>
          <div>
            <h1 className="text-lg font-bold text-indigo-950">{t(categoryLabelKey[category] || 'gotIt')}</h1>
            <span className="text-indigo-400/60 text-xs font-medium">{terms.length} {t('words')} · {t(categorySublabelKey[category] || 'mastered')}</span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/70">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-[18px] pl-11 pr-4 py-3 text-sm text-indigo-900 placeholder:text-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-300/30"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        />
      </div>

      {/* Batch actions */}
      {selected.size > 0 && !isFav && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[20px] p-3 flex gap-2 mb-4"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <button onClick={() => moveAll('gotIt')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95" style={{ background: 'rgba(52,199,89,0.12)', color: '#34c759' }}>{t('batchGotIt')}</button>
          <button onClick={() => moveAll('notSure')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95" style={{ background: 'rgba(255,159,10,0.12)', color: '#ff9f0a' }}>{t('batchNotSure')}</button>
          <button onClick={relearnAll} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{t('batchRelearn')}</button>
        </motion.div>
      )}

      {/* Term list */}
      {termData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div
            className="w-20 h-20 rounded-[22px] flex items-center justify-center text-3xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.06) 100%)',
              border: '1px solid rgba(226,232,255,0.2)',
            }}
          >
            {terms.length === 0 ? '📭' : '🔍'}
          </div>
          <p className="text-indigo-400/60 text-sm font-medium">
            {terms.length === 0 ? t('empty') : t('noMatch')}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {termData.map((t, i) => (
            <motion.div
              key={t.term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="cursor-pointer transition-all active:scale-[0.98]"
              onClick={() => {
                if (selected.size > 0) {
                  setSelected(prev => {
                    const next = new Set(prev)
                    next.has(t.term) ? next.delete(t.term) : next.add(t.term)
                    return next
                  })
                } else {
                  navigate(`/term/${encodeURIComponent(t.term)}`)
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setSelected(prev => {
                  const next = new Set(prev)
                  next.has(t.term) ? next.delete(t.term) : next.add(t.term)
                  return next
                })
              }}
            >
              <div
                className="rounded-[20px] p-4"
                style={{
                  background: selected.has(t.term)
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)'
                    : '#ffffff',

                  border: selected.has(t.term) ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(226,232,255,0.25)',
                  boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-indigo-950 font-semibold text-[15px]">{t.term}</span>
                  <div className="flex gap-1 shrink-0">
                    {t.chapters?.slice(0, 3).map(ch => (
                      <span key={ch} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8' }}>
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-indigo-500/40 text-xs leading-relaxed line-clamp-2">{t.definition}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
