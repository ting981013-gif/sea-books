import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import glossary from '../data/glossary'
import defaultBooks from '../data/books'

// Menu icons
const PlanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const BooksIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StatsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const HelpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-indigo-300/60">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Shared card style for visible boundaries
const cardStyle = {
  background: '#ffffff',
  border: '1px solid rgba(226, 232, 255, 0.2)',
  boxShadow: '0 1px 2px rgba(99, 102, 241, 0.03)',
}

const menuItemStyle = {
  borderBottom: '1px solid rgba(226, 232, 255, 0.2)',
}

export default function My({ store }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { state, setNickname, setAvatar, t } = store
  const totalStudied = state.memory.gotIt.length + state.memory.notSure.length + state.memory.forgot.length
  const progressPct = Math.round((totalStudied / glossary.length) * 100)

  const currentBook = defaultBooks.find(b => b.id === state.currentBookId) || (state.customBooks || []).find(b => b.id === state.currentBookId) || defaultBooks[0]

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatar(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const shortcuts = [
    { icon: <PlanIcon />, label: t('plan'), desc: t('planDesc'), to: '/plan' },
    { icon: <BooksIcon />, label: t('books'), desc: t('booksDesc'), to: '/books' },
  ]

  const menuItems = [
    { icon: <StatsIcon />, label: t('statistics'), to: '/statistics', hasArrow: true },
    { icon: <BellIcon />, label: t('reminders'), isToggle: true, hasArrow: false },
    { icon: <SettingsIcon />, label: t('settings'), to: '/settings', hasArrow: true },
    { icon: <HelpIcon />, label: t('helpFeedback'), to: '/help', hasArrow: true },
    { icon: <InfoIcon />, label: t('about'), to: '/about', hasArrow: true },
  ]

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-5 rounded-[20px] p-4"
        style={cardStyle}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative w-[56px] h-[56px] rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 overflow-hidden active:scale-95 transition-transform"
          style={{
            background: state.avatar ? 'transparent' : '#e0dcff',
            boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
          }}
        >
          {state.avatar ? (
            <img src={state.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            state.nickname.charAt(0).toUpperCase()
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <CameraIcon />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-bold text-indigo-950">{state.nickname}</h2>
            <button
              onClick={() => {
                const name = prompt(t('nicknamePrompt'), state.nickname)
                if (name) setNickname(name)
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-indigo-400/50 hover:text-indigo-500 active:scale-90 transition-all"
              style={{ background: 'rgba(99,102,241,0.08)' }}
            >
              <EditIcon />
            </button>
          </div>
          <p className="text-[13px] text-indigo-400/60 font-medium">{t('slogan')}</p>
        </div>
      </motion.div>

      {/* Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        {shortcuts.map(s => (
          <button
            key={s.label}
            onClick={() => navigate(s.to)}
            className="rounded-[18px] p-4 text-left active:scale-[0.98] transition-all"
            style={cardStyle}
          >
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-2.5" style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)' }}>
              {s.icon}
            </div>
            <div className="text-[14px] font-bold text-indigo-950">{s.label}</div>
            <div className="text-[11px] text-indigo-400/50 font-medium mt-0.5">{s.desc}</div>
          </button>
        ))}
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[20px] overflow-hidden mb-5"
        style={cardStyle}
      >
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => item.isToggle ? store.toggleReminders() : item.to && navigate(item.to)}
            className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 active:bg-indigo-50/50 transition-colors ${
              i < menuItems.length - 1 ? '' : ''
            }`}
            style={i < menuItems.length - 1 ? menuItemStyle : {}}
          >
            <div className="text-indigo-400/60 shrink-0">{item.icon}</div>
            <div className="flex-1 text-[15px] font-semibold text-indigo-950">{item.label}</div>
            {item.isToggle ? (
              <div
                className="w-11 h-6 rounded-full relative shrink-0 transition-colors duration-200"
                style={{
                  background: store.state.remindersEnabled
                    ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                    : '#d4d4d8',
                }}
                onClick={(e) => { e.stopPropagation(); store.toggleReminders() }}
              >
                <div
                  className="absolute w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{
                    top: '2px',
                    left: store.state.remindersEnabled ? '24px' : '2px',
                  }}
                />
              </div>
            ) : (
              item.hasArrow && <ArrowRight />
            )}
          </button>
        ))}
      </motion.div>

      {/* Learning Book */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-[20px] p-4 flex items-center gap-3"
        style={cardStyle}
      >
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-lg shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(167,139,250,0.06) 100%)',
            border: '1px solid rgba(226,232,255,0.25)',
          }}
        >
          📘
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-indigo-400/50 font-bold uppercase tracking-wider">{t('learningBook')}</div>
          <div className="text-[14px] font-bold text-indigo-950 truncate">{currentBook.title}</div>
          <div className="text-[11px] text-indigo-400/50 truncate">{currentBook.subtitle}</div>
        </div>
        <button
          onClick={() => navigate('/books')}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold active:scale-95 transition-all shrink-0"
          style={{
            background: 'rgba(99,102,241,0.08)',
            color: '#818cf8',
          }}
        >
          {t('change')}
        </button>
      </motion.div>
    </div>
  )
}
