import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

export default function Settings({ store }) {
  const navigate = useNavigate()
  const { state, setLanguage, logout, t } = store

  const handleLogout = () => {
    if (confirm(t('logoutConfirm'))) {
      logout()
      navigate('/onboarding', { replace: true })
    }
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
        <h1 className="text-lg font-bold text-indigo-950">{t('settingsTitle')}</h1>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[20px] p-5 mb-4"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-3">{t('language')}</div>
        <div className="space-y-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="w-full rounded-[14px] p-3 flex items-center gap-3 text-left active:scale-[0.98] transition-all"
              style={{
                background: state.language === lang.code
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(167,139,250,0.06) 100%)'
                  : '#f8f8ff',
                border: state.language === lang.code ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(226,232,255,0.25)',
              }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-[15px] font-semibold text-indigo-950 flex-1">{lang.label}</span>
              {state.language === lang.code && (
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

    </div>
  )
}
