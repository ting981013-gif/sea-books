import { NavLink } from 'react-router-dom'

// iOS SF Symbols style icons - filled when active, outline when inactive
const LearningIcon = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    {active ? (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" opacity="0.2"/>
    ) : (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
)

const MemoryIcon = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    {active ? (
      <>
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A6.98 6.98 0 0 0 19 9a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A6.98 6.98 0 0 0 19 9a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </>
    )}
  </svg>
)

const MyIcon = ({ active }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    {active ? (
      <>
        <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.2"/>
      </>
    ) : (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </>
    )}
  </svg>
)

const tabKeys = [
  { to: '/learning', Icon: LearningIcon, key: 'learningTitle' },
  { to: '/memory', Icon: MemoryIcon, key: 'memoryTitle' },
  { to: '/my', Icon: MyIcon, key: 'myTitle' },
]

export default function BottomNav({ store }) {
  const { t } = store || {}
  const tabs = tabKeys.map(tab => ({
    ...tab,
    label: t?.(tab.key) || tab.key,
  }))

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div
        className="mx-4 mb-3 rounded-[28px] flex justify-around items-center"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
          height: '64px',
        }}
      >
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-300 ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-indigo-300/60 hover:text-indigo-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <tab.Icon active={isActive} />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
