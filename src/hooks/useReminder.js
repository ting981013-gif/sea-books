import { useEffect, useRef } from 'react'

const REMINDER_SENT_KEY = 'sea-words-reminder-sent-date'

const FUNNY_MESSAGES = [
  '🧠 大脑说它饿了！快来喂点新单词吧～',
  '⏰ 该学习了！你的词汇量还在等你拯救呢！',
  '📚 哎呀，今天还没背单词？你的海马体正在哭泣...',
  '🔥 你的脑细胞正在喊：快来复习！',
  '🤓 学霸模式已待机，点击开启今日学习！',
  '💡 知识就是力量，今天你的力量值有点低哦～',
  '📖 书山有路勤为径，今天你也来爬两步？',
  '🧪 你的词汇实验室该开门营业啦！',
]

function getRandomMessage() {
  return FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]
}

function getMsUntil8PM() {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0)
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }
  return target.getTime() - now.getTime()
}

function shouldSendToday() {
  const today = new Date().toISOString().slice(0, 10)
  return localStorage.getItem(REMINDER_SENT_KEY) !== today
}

function markSent() {
  localStorage.setItem(REMINDER_SENT_KEY, new Date().toISOString().slice(0, 10))
}

function sendNotification() {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  try {
    new Notification('Sea Words', {
      body: getRandomMessage(),
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'daily-reminder',
      renotify: true,
    })
    markSent()
  } catch {
    // Silent fail
  }
}

export function useReminder(remindersEnabled) {
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!remindersEnabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Request permission if not already decided
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Check if we missed today's 8PM (e.g. user opens app after 8PM)
    const now = new Date()
    if (now.getHours() >= 20 && shouldSendToday()) {
      sendNotification()
    }

    // Schedule next reminder
    const schedule = () => {
      const ms = getMsUntil8PM()
      timeoutRef.current = setTimeout(() => {
        if (shouldSendToday()) {
          sendNotification()
        }
        schedule()
      }, ms)
    }

    schedule()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [remindersEnabled])
}
