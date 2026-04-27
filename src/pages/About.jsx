import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function About({ store }) {
  const navigate = useNavigate()
  const { t } = store || {}

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
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
        <h1 className="text-lg font-bold text-indigo-950">{t?.('aboutTitle') || 'About'}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <div
          className="w-20 h-20 rounded-[22px] flex items-center justify-center text-4xl mb-4"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
          }}
        >
          📚
        </div>
        <div className="text-xl font-bold text-indigo-950">Sea Words</div>
        <div className="text-[13px] text-indigo-400/60 mt-1">{t?.('version') || 'Version'} 1.0.0</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[20px] overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        {[
          { label: t?.('build') || 'Build', value: '2025.04.27.1' },
          { label: t?.('framework') || 'Framework', value: 'React 19 + Vite 8' },
          { label: t?.('dataSource') || 'Data Source', value: 'Anatomy & Physiology Glossary' },
          { label: t?.('terms') || 'Terms', value: '1,399' },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className={`flex justify-between items-center px-4 py-3.5 ${
              i < arr.length - 1 ? 'border-b border-white/30' : ''
            }`}
          >
            <span className="text-[14px] text-indigo-400/70 font-medium">{item.label}</span>
            <span className="text-[14px] font-semibold text-indigo-950">{item.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
