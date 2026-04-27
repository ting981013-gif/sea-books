import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function useFaqs(t) {
  return [
    { q: t('faq1_q'), a: t('faq1_a') },
    { q: t('faq2_q'), a: t('faq2_a') },
    { q: t('faq3_q'), a: t('faq3_a') },
    { q: t('faq4_q'), a: t('faq4_a') },
    { q: t('faq5_q'), a: t('faq5_a') },
  ]
}

export default function HelpFeedback({ store }) {
  const navigate = useNavigate()
  const { t } = store || {}
  const faqs = useFaqs(t || ((k) => k))

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
        <h1 className="text-lg font-bold text-indigo-950">{t?.('helpTitle') || 'Help & Feedback'}</h1>
      </motion.div>

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
        <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-4">{t?.('faq') || 'Frequently Asked Questions'}</div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i}>
              <div className="text-[14px] font-bold text-indigo-950 mb-1">{faq.q}</div>
              <div className="text-[13px] text-indigo-400/70 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </motion.div>

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
        <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-3">{t?.('contactUs') || 'Contact Us'}</div>
        <p className="text-[13px] text-indigo-400/70 leading-relaxed">
          {t?.('contactDesc') || 'If you have any other questions or suggestions, feel free to reach out at'}
          {' '}
          <span className="font-semibold" style={{ color: '#818cf8' }}>support@seawords.app</span>
        </p>
      </motion.div>
    </div>
  )
}
