import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Learning from './pages/Learning'
import Memory from './pages/Memory'
import MemoryList from './pages/MemoryList'
import TermDetail from './pages/TermDetail'
import My from './pages/My'
import Plan from './pages/Plan'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import Onboarding from './pages/Onboarding'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import About from './pages/About'
import HelpFeedback from './pages/HelpFeedback'

function OnboardingGuard({ store, children }) {
  const location = useLocation()
  if (!store.state.hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

export default function App() {
  const store = useStore()

  return (
    <Routes>
      {/* Onboarding is outside Layout (no bottom nav) */}
      <Route path="/onboarding" element={<Onboarding store={store} />} />

      {/* Main app routes */}
      <Route element={
        <OnboardingGuard store={store}>
          <Layout store={store} />
        </OnboardingGuard>
      }>
        <Route path="/" element={<Navigate to="/learning" replace />} />
        <Route path="/learning" element={<Learning store={store} />} />
        <Route path="/memory" element={<Memory store={store} />} />
        <Route path="/memory/:category" element={<MemoryList store={store} />} />
        <Route path="/term/:termId" element={<TermDetail store={store} />} />
        <Route path="/my" element={<My store={store} />} />
        <Route path="/plan" element={<Plan store={store} />} />
        <Route path="/books" element={<Books store={store} />} />
        <Route path="/books/:bookId" element={<BookDetail store={store} />} />
        <Route path="/statistics" element={<Statistics store={store} />} />
        <Route path="/settings" element={<Settings store={store} />} />
        <Route path="/about" element={<About store={store} />} />
        <Route path="/help" element={<HelpFeedback store={store} />} />
      </Route>
    </Routes>
  )
}
