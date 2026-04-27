import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import defaultBooks from '../data/books'
import glossary from '../data/glossary'
import chapters from '../data/chapters'

export default function BookDetail({ store }) {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { t } = store
  const book = defaultBooks.find(b => b.id === bookId) || (store.state.customBooks || []).find(b => b.id === bookId)

  if (!book) {
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
        <p className="text-indigo-400/60 text-sm">{t('bookNotFound')}</p>
      </div>
    )
  }

  const isCustom = book.isCustom
  const bookTerms = isCustom ? (book.terms || []) : glossary
  const totalTerms = book.totalTerms || bookTerms.length

  const studiedCount = bookTerms.filter(t =>
    store.state.memory.gotIt.includes(t.term) ||
    store.state.memory.notSure.includes(t.term) ||
    store.state.memory.forgot.includes(t.term)
  ).length

  const masteredCount = bookTerms.filter(t =>
    store.state.memory.gotIt.includes(t.term)
  ).length

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
        <div>
          <h1 className="text-lg font-bold text-indigo-950">{book.title}</h1>
          <p className="text-[12px] text-indigo-400/60 font-medium">{book.subtitle}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { label: t('totalTerms'), value: totalTerms, color: '#6366f1' },
          { label: t('mastered'), value: masteredCount, color: '#34c759' },
          { label: isCustom ? t('studied') : t('chaptersTitle'), value: isCustom ? studiedCount : chapters.length, color: '#a78bfa' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-[18px] p-3 text-center"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(226,232,255,0.25)',
              boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
            }}
          >
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] text-indigo-400/60 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Default book: Chapters */}
      {!isCustom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-3">{t('chaptersTitle')}</div>
          <div className="space-y-2.5 pb-4">
            {chapters.map((ch, i) => {
              const terms = glossary.filter(g => g.chapters.includes(ch.id))
              const studied = terms.filter(t =>
                store.state.memory.gotIt.includes(t.term) ||
                store.state.memory.notSure.includes(t.term) ||
                store.state.memory.forgot.includes(t.term)
              )
              const pct = terms.length > 0 ? (studied.length / terms.length) * 100 : 0
              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.02 }}
                  className="rounded-[18px] p-3.5"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226,232,255,0.25)',
                    boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-semibold text-indigo-950">Ch.{ch.id} {ch.name}</span>
                    <span className="text-[11px] text-indigo-400/60 font-medium">{studied.length}/{terms.length}</span>
                  </div>
                  <div className="rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(226,232,255,0.5)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #818cf8 0%, #a78bfa 100%)',
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-indigo-300/50 mt-1.5 italic">{ch.case}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Custom book: Terms list */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-3">{t('termsSection')}</div>
          <div className="space-y-2.5 pb-4">
            {book.terms.map((t, i) => {
              const isStudied = store.state.memory.gotIt.includes(t.term) || store.state.memory.notSure.includes(t.term) || store.state.memory.forgot.includes(t.term)
              const isMastered = store.state.memory.gotIt.includes(t.term)
              return (
                <motion.div
                  key={t.term}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.01 }}
                  className="rounded-[18px] p-3.5 flex items-center gap-3"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226,232,255,0.25)',
                    boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isMastered
                        ? 'rgba(52,199,89,0.12)'
                        : isStudied
                        ? 'rgba(255,159,10,0.12)'
                        : 'rgba(99,102,241,0.06)',
                    }}
                  >
                    {isMastered ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 13l3 3 7-7" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : isStudied ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#ff9f0a" strokeWidth="2" fill="none"/></svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-indigo-300/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-indigo-950 truncate">{t.term}</div>
                    <div className="text-[11px] text-indigo-400/50 truncate">{t.definition}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
