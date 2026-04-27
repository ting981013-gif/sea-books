import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import defaultBooks from '../data/books'

export default function Plan({ store }) {
  const navigate = useNavigate()
  const { state, setDailyGoal, setNickname, setCurrentBook } = store
  const [goal, setGoal] = useState(state.dailyGoal)
  const [name, setName] = useState(state.nickname)
  const [selectedBookId, setSelectedBookId] = useState(state.currentBookId)

  const customBooks = state.customBooks || []
  const allBooks = [
    { id: 'a-and-p-glossary', title: 'Oxford 3000', subtitle: '3000 Core Vocabulary' },
    ...defaultBooks.filter(b => b.id !== 'a-and-p-glossary'),
    ...customBooks,
  ]

  const handleSave = () => {
    setDailyGoal(Number(goal))
    setNickname(name)
    setCurrentBook(selectedBookId)
    navigate(-1)
  }

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
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
        <h1 className="text-lg font-bold text-indigo-950">Learning Plan</h1>
      </motion.div>

      <div className="space-y-4">
        {/* Nickname */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[20px] p-5"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <label className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-2.5 block">Nickname</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-[14px] px-4 py-3 text-[15px] text-indigo-950 placeholder:text-indigo-300/50 outline-none focus:ring-2 focus:ring-indigo-300/30"
            style={{
              background: '#f8f8ff',
              border: '1px solid rgba(226,232,255,0.25)',
            }}
          />
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[20px] p-5"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <label className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-2.5 block">Daily Goal (words/day)</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGoal(Math.max(1, goal - 5))}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center text-indigo-500 font-bold text-lg active:scale-90 transition-transform"
              style={{
                background: 'rgba(99,102,241,0.08)',
              }}
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="100"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              className="flex-1 text-center rounded-[14px] px-4 py-3 text-[18px] font-bold text-indigo-950 outline-none focus:ring-2 focus:ring-indigo-300/30"
              style={{
                background: '#f8f8ff',
                border: '1px solid rgba(226,232,255,0.25)',
              }}
            />
            <button
              onClick={() => setGoal(Math.min(100, goal + 5))}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center text-indigo-500 font-bold text-lg active:scale-90 transition-transform"
              style={{
                background: 'rgba(99,102,241,0.08)',
              }}
            >
              +
            </button>
          </div>

          <div className="flex gap-2 mt-3">
            {[10, 20, 30, 50].map(n => (
              <button
                key={n}
                onClick={() => setGoal(n)}
                className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-95"
                style={{
                  background: goal === n ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' : 'rgba(99,102,241,0.06)',
                  color: goal === n ? '#fff' : '#818cf8',
                  boxShadow: goal === n ? '0 2px 8px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                {n} words
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projected Goals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[20px] p-5"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-4">Projected Goals</div>
          <div className="space-y-3">
            {[
              { label: 'Weekly', value: `${goal * 7} words` },
              { label: 'Monthly', value: `${goal * 30} words` },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-[14px] text-indigo-400/70 font-medium">{item.label}</span>
                <span className="text-[15px] font-bold text-indigo-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Book */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-[20px] p-5"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-3">Learning Book</div>
          <div className="space-y-2">
            {allBooks.slice(0, 5).map(book => (
              <button
                key={book.id}
                onClick={() => setSelectedBookId(book.id)}
                className="w-full rounded-[14px] p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all"
                style={{
                  background: selectedBookId === book.id
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(167,139,250,0.06) 100%)'
                    : '#f8f8ff',
                  border: selectedBookId === book.id ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(226,232,255,0.25)',
                }}
              >
                <div className="text-xl">{book.isCustom ? '📄' : '📘'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-indigo-950 truncate">{book.title}</div>
                  <div className="text-[11px] text-indigo-400/50 truncate">{book.subtitle}</div>
                </div>
                {selectedBookId === book.id && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Study Reminder Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] p-5 flex items-center justify-between"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          }}
        >
          <div>
            <div className="text-[15px] font-semibold text-indigo-950">Study Reminder</div>
            <div className="text-[12px] text-indigo-400/60 font-medium">Every day at 08:00 PM</div>
          </div>
          <div
            className="w-12 h-7 rounded-full relative"
            style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)' }}
          >
            <div
              className="absolute w-5 h-5 rounded-full bg-white shadow-md"
              style={{ top: '4px', right: '4px' }}
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          onClick={handleSave}
          className="w-full py-4 rounded-[20px] text-white font-bold text-[15px] active:scale-[0.98] transition-all mt-2"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
          }}
        >
          Save Plan
        </motion.button>
      </div>
    </div>
  )
}
