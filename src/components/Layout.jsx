import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout({ store }) {
  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: '#f5f5ff' }}>
      <main className="flex-1 overflow-y-auto pb-24 relative z-10">
        <Outlet context={{ store }} />
      </main>
      <BottomNav store={store} />
    </div>
  )
}