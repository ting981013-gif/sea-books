import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PRESETS = [10, 20, 30, 50]

export default function Onboarding({ store }) {
  const navigate = useNavigate()
  const { setDailyGoal, setNickname, completeOnboarding } = store
  const [goal, setGoal] = useState(20)

  const handleStart = () => {
    setDailyGoal(goal)
    setNickname('Learner')
    completeOnboarding()
    navigate('/learning', { replace: true })
  }

  const handleSurprise = () => {
    const randomGoal = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]
    setGoal(randomGoal)
  }

  return (
    <div className="flex flex-col h-dvh px-6 pt-12 pb-8"
      style={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #f8f6ff 40%, #f0f7ff 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-[28px] font-bold text-indigo-950 mb-3">
          Set Your Daily Goal
        </h1>
        <p className="text-[15px] text-indigo-400/70 leading-relaxed">
          How many new words would you like<br />to learn every day?
        </p>
      </motion.div>

      {/* Goal selector card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-[28px] p-8 mb-6 text-center"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        <div className="flex items-center justify-center gap-8 mb-2">
          <button
            onClick={() => setGoal(Math.max(1, goal - 1))}
            className="w-12 h-12 rounded-full flex items-center justify-center text-indigo-400 text-2xl font-light active:scale-90 transition-all"
            style={{
              background: '#f8f8ff',
              border: '1px solid rgba(226,232,255,0.25)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
            }}
          >
            −
          </button>

          <div className="text-5xl font-bold" style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {goal}
          </div>

          <button
            onClick={() => setGoal(Math.min(100, goal + 1))}
            className="w-12 h-12 rounded-full flex items-center justify-center text-indigo-400 text-2xl font-light active:scale-90 transition-all"
            style={{
              background: '#f8f8ff',
              border: '1px solid rgba(226,232,255,0.25)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
            }}
          >
            +
          </button>
        </div>

        <div className="text-[13px] text-indigo-400/50 font-medium mt-1">words / day</div>
      </motion.div>

      {/* Quick fill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-6"
      >
        <div className="text-[13px] font-bold text-indigo-950 mb-3">Quick fill (recommended)</div>
        <div className="flex gap-2.5">
          {PRESETS.map(n => (
            <button
              key={n}
              onClick={() => setGoal(n)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all active:scale-95"
              style={{
                background: goal === n
                  ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                  : '#ffffff',
                color: goal === n ? '#fff' : '#818cf8',
                border: goal === n ? 'none' : '1px solid rgba(226,232,255,0.25)',
                boxShadow: goal === n ? '0 4px 12px rgba(99,102,241,0.2)' : '0 2px 8px rgba(99,102,241,0.04)',
              }}
            >
              {n} words
            </button>
          ))}
        </div>
      </motion.div>

      {/* Surprise me */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-auto"
      >
        <div className="text-[13px] font-bold text-indigo-950 mb-1">Not sure?</div>
        <div className="text-[12px] text-indigo-400/60 mb-3">We'll randomly recommend a number for you.</div>
        <button
          onClick={handleSurprise}
          className="w-full py-3.5 rounded-[18px] text-[14px] font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226,232,255,0.25)',
            color: '#6366f1',
            boxShadow: '0 2px 8px rgba(99,102,241,0.04)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          I'm not sure, surprise me!
        </button>
      </motion.div>

      {/* Start Learning */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        onClick={handleStart}
        className="w-full py-4 rounded-[20px] text-white font-bold text-[16px] active:scale-[0.98] transition-all"
        style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          boxShadow: '0 8px 28px rgba(99,102,241,0.3)',
        }}
      >
        Start Learning
      </motion.button>
    </div>
  )
}
