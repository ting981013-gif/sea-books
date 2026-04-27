import { useState, useCallback, useEffect } from 'react'
import translations from '../i18n/translations'

const STORAGE_KEY = 'sea-words-store'

const defaultState = {
  nickname: 'Learner',
  dailyGoal: 10,
  currentBookId: 'a-and-p-glossary',
  memory: {
    gotIt: [],
    notSure: [],
    forgot: [],
  },
  favorites: [],
  todayStudied: [],
  todayDate: '',
  studyHistory: [],
  avatar: '',
  language: 'en',
  remindersEnabled: true,
  hasCompletedOnboarding: false,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    // Reset daily if day changed
    const today = new Date().toISOString().slice(0, 10)
    if (parsed.todayDate !== today) {
      parsed.todayStudied = []
      parsed.todayDate = today
    }
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useStore() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const setNickname = useCallback((name) => {
    setState(s => ({ ...s, nickname: name }))
  }, [])

  const setDailyGoal = useCallback((n) => {
    setState(s => ({ ...s, dailyGoal: n }))
  }, [])

  const setCurrentBook = useCallback((id) => {
    setState(s => ({ ...s, currentBookId: id }))
  }, [])

  const markTerm = useCallback((termId, category) => {
    setState(s => {
      const memory = { ...s.memory }
      // Remove from all categories first
      memory.gotIt = memory.gotIt.filter(t => t !== termId)
      memory.notSure = memory.notSure.filter(t => t !== termId)
      memory.forgot = memory.forgot.filter(t => t !== termId)
      // Add to target category
      if (category === 'gotIt') memory.gotIt = [...memory.gotIt, termId]
      else if (category === 'notSure') memory.notSure = [...memory.notSure, termId]
      else if (category === 'forgot') memory.forgot = [...memory.forgot, termId]

      const todayStudied = [...s.todayStudied, termId]
      return { ...s, memory, todayStudied }
    })
  }, [])

  const moveTerm = useCallback((termId, fromCategory, toCategory) => {
    setState(s => {
      const memory = { ...s.memory }
      memory[fromCategory] = memory[fromCategory].filter(t => t !== termId)
      if (!memory[toCategory].includes(termId)) {
        memory[toCategory] = [...memory[toCategory], termId]
      }
      return { ...s, memory }
    })
  }, [])

  const removeTermFromMemory = useCallback((termId, category) => {
    setState(s => {
      const memory = { ...s.memory }
      memory[category] = memory[category].filter(t => t !== termId)
      return { ...s, memory }
    })
  }, [])

  const addCustomBook = useCallback((book) => {
    setState(s => ({ ...s, customBooks: [...(s.customBooks || []), book] }))
  }, [])

  const toggleFavorite = useCallback((termId) => {
    setState(s => {
      const favorites = s.favorites || []
      const isFav = favorites.includes(termId)
      return {
        ...s,
        favorites: isFav
          ? favorites.filter(t => t !== termId)
          : [...favorites, termId],
      }
    })
  }, [])

  const setAvatar = useCallback((dataUrl) => {
    setState(s => ({ ...s, avatar: dataUrl }))
  }, [])

  const setLanguage = useCallback((lang) => {
    setState(s => ({ ...s, language: lang }))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ ...defaultState })
  }, [])

  const completeOnboarding = useCallback(() => {
    setState(s => ({ ...s, hasCompletedOnboarding: true }))
  }, [])

  const toggleReminders = useCallback(() => {
    setState(s => ({ ...s, remindersEnabled: !s.remindersEnabled }))
  }, [])

  const t = useCallback((key) => {
    const lang = state.language || 'en'
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }, [state.language])

  return {
    state,
    setNickname,
    setDailyGoal,
    setCurrentBook,
    setAvatar,
    setLanguage,
    markTerm,
    moveTerm,
    removeTermFromMemory,
    addCustomBook,
    toggleFavorite,
    logout,
    completeOnboarding,
    toggleReminders,
    t,
  }
}
