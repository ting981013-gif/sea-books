import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// iOS-style SF Symbols inspired icons
const GotItIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const NotSureIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.2" fill="none"/>
    <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const ForgotIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
)

const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-40">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Circular progress component
function CircularProgress({ percentage, size = 120, strokeWidth = 10, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(226,232,255,0.5)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  )
}

const categoryConfig = [
  {
    key: 'gotIt',
    color: '#34c759',
    iconColor: 'text-emerald-500',
    icon: <GotItIcon />,
  },
  {
    key: 'notSure',
    color: '#ff9f0a',
    iconColor: 'text-amber-500',
    icon: <NotSureIcon />,
  },
  {
    key: 'forgot',
    color: '#ff3b30',
    iconColor: 'text-rose-500',
    icon: <ForgotIcon />,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Memory({ store }) {
  const navigate = useNavigate()
  const { memory, favorites } = store.state
  const { t } = store
  const total = memory.gotIt.length + memory.notSure.length + memory.forgot.length
  const masteryRate = total > 0 ? Math.round((memory.gotIt.length / total) * 100) : 0
  const favCount = (favorites || []).length

  const catMeta = {
    gotIt: { label: t('gotIt'), sublabel: t('mastered') },
    notSure: { label: t('notSureBtn'), sublabel: t('needReview') },
    forgot: { label: t('forgotBtn'), sublabel: t('difficult') },
  }

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-[28px] font-bold text-indigo-950 tracking-tight">{t('memoryTitle')}</h1>
        <p className="text-indigo-400/80 text-[15px] mt-0.5">{t('reviewProgress')}</p>
      </motion.div>

      {/* Overview Card */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[28px] p-6 mb-6"
          style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            border: '1px solid rgba(196,181,253,0.35)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-indigo-900 tracking-tight">{total}</div>
              <div className="text-[13px] text-indigo-500/70 mt-1 font-medium">{t('total')} {total}</div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-indigo-500/60 font-medium">{memory.gotIt.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-indigo-500/60 font-medium">{memory.notSure.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-xs text-indigo-500/60 font-medium">{memory.forgot.length}</span>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <CircularProgress
                percentage={masteryRate}
                size={110}
                strokeWidth={10}
                color="#34c759"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-indigo-900">{masteryRate}%</span>
                <span className="text-[10px] text-indigo-400/70 font-medium uppercase tracking-wider">{t('mastered')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Cards */}
      <div className="space-y-3 mb-6">
        {categoryConfig.map((cat, i) => {
          const count = memory[cat.key].length
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <motion.button
              key={cat.key}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              onClick={() => navigate(`/memory/${cat.key}`)}
              className="w-full text-left transition-all active:scale-[0.98]"
            >
              <div
                className="rounded-[24px] p-4 flex items-center gap-4"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(226,232,255,0.35)',
                  boxShadow: '0 1px 2px rgba(99,102,241,0.03), 0 2px 6px rgba(99,102,241,0.02)',
                }}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 ${cat.iconColor}`}
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}18 0%, ${cat.color}0d 100%)`,
                    border: `1px solid ${cat.color}30`,
                  }}
                >
                  {cat.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="font-semibold text-[15px] text-indigo-900">{catMeta[cat.key].label}</div>
                      <div className="text-[12px] text-indigo-400/60 font-medium">{catMeta[cat.key].sublabel}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-indigo-900">{count}</span>
                      <ChevronRight />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(226,232,255,0.5)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}

        {/* Favorites card */}
        <motion.button
          custom={categoryConfig.length}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          onClick={() => navigate('/memory/favorites')}
          className="w-full text-left transition-all active:scale-[0.98]"
        >
          <div
            className="rounded-[24px] p-4 flex items-center gap-4"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(226,232,255,0.75)',
              boxShadow: '0 1px 3px rgba(99,102,241,0.05), 0 2px 8px rgba(99,102,241,0.03)',
            }}
          >
            <div
              className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 text-amber-400"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.06) 100%)',
                border: '1px solid rgba(251,191,36,0.25)',
              }}
            >
              <StarIcon />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="font-semibold text-[15px] text-indigo-900">{t('favorites')}</div>
                  <div className="text-[12px] text-indigo-400/60 font-medium">{t('favoriteDesc')}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-indigo-900">{favCount}</span>
                  <ChevronRight />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center text-4xl mx-auto mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.08) 100%)',
              border: '1px solid rgba(226,232,255,0.2)',
              boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
            }}
          >
            📚
          </div>
          <p className="text-indigo-400/70 text-sm font-medium">{t('empty')}</p>
        </motion.div>
      )}

      {/* Summary detail card */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-[24px] p-5"
          style={{
            background: '#faf9ff',
            border: '1px solid rgba(226,232,255,0.35)',
            boxShadow: '0 1px 2px rgba(99,102,241,0.03), 0 2px 6px rgba(99,102,241,0.02)',
          }}
        >
          <h3 className="text-[11px] text-indigo-400/70 uppercase tracking-[0.06em] font-semibold mb-4">{t('distribution')}</h3>
          <div className="flex rounded-full h-3 overflow-hidden mb-3" style={{ background: 'rgba(226,232,255,0.5)' }}>
            {memory.gotIt.length > 0 && (
              <div
                className="transition-all duration-700 ease-out"
                style={{
                  width: `${(memory.gotIt.length / total) * 100}%`,
                  backgroundColor: '#34c759',
                }}
              />
            )}
            {memory.notSure.length > 0 && (
              <div
                className="transition-all duration-700 ease-out"
                style={{
                  width: `${(memory.notSure.length / total) * 100}%`,
                  backgroundColor: '#ff9f0a',
                }}
              />
            )}
            {memory.forgot.length > 0 && (
              <div
                className="transition-all duration-700 ease-out"
                style={{
                  width: `${(memory.forgot.length / total) * 100}%`,
                  backgroundColor: '#ff3b30',
                }}
              />
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34c759' }} />
              <span className="text-[11px] text-indigo-500/50 font-medium">{t('gotIt')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff9f0a' }} />
              <span className="text-[11px] text-indigo-500/50 font-medium">{t('notSureBtn')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff3b30' }} />
              <span className="text-[11px] text-indigo-500/50 font-medium">{t('forgotBtn')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
