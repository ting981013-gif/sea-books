import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const COLORS = ['#34c759', '#ff9f0a', '#ff3b30']

function buildLineData(range, memory) {
  const got = memory.gotIt.length
  const ns = memory.notSure.length
  const fg = memory.forgot.length

  // 不同时间范围的累计倍数，让 Week/Month/Year 的终值有区分度
  const rangeFactor = range === 'Week' ? 1 : range === 'Month' ? 1.6 : 2.5

  if (range === 'Year') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((m, i) => {
      const factor = ((i + 1) / 12) * rangeFactor
      return {
        day: m,
        gotIt: Math.max(0, Math.round(got * factor)),
        notSure: Math.max(0, Math.round(ns * factor)),
        forgot: Math.max(0, Math.round(fg * factor)),
      }
    })
  }

  if (range === 'Month') {
    return Array.from({ length: 4 }, (_, i) => {
      const factor = ((i + 1) / 4) * rangeFactor
      return {
        day: `W${i + 1}`,
        gotIt: Math.max(0, Math.round(got * factor)),
        notSure: Math.max(0, Math.round(ns * factor)),
        forgot: Math.max(0, Math.round(fg * factor)),
      }
    })
  }

  // Week (default)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((d, i) => {
    const factor = ((i + 1) / 7) * rangeFactor
    return {
      day: d,
      gotIt: Math.max(0, Math.round(got * factor - (6 - i) * 0.3)),
      notSure: Math.max(0, Math.round(ns * factor - (6 - i) * 0.2)),
      forgot: Math.max(0, Math.round(fg * factor - (6 - i) * 0.1)),
    }
  })
}

export default function Statistics({ store }) {
  const navigate = useNavigate()
  const { state, t } = store
  const { memory } = state

  const timeRanges = ['Week', 'Month', 'Year']
  const [range, setRange] = useState('Week')

  const lineData = useMemo(() => buildLineData(range, memory), [range, memory])

  // 使用折线图最后一天的数据作为当前时间范围的统计值，确保饼图/概览与折线图联动
  const last = lineData[lineData.length - 1] || { gotIt: 0, notSure: 0, forgot: 0 }
  const stats = { gotIt: last.gotIt, notSure: last.notSure, forgot: last.forgot }
  const total = stats.gotIt + stats.notSure + stats.forgot

  const pieData = [
    { name: t('gotIt'), value: stats.gotIt, color: COLORS[0] },
    { name: t('notSureBtn'), value: stats.notSure, color: COLORS[1] },
    { name: t('forgotBtn'), value: stats.forgot, color: COLORS[2] },
  ].filter(d => d.value > 0)

  return (
    <div className="px-5 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
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
        <h1 className="text-lg font-bold text-indigo-950">{t('statisticsTitle')}</h1>
      </motion.div>

      {/* Time range selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-5"
      >
        {timeRanges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all active:scale-95"
            style={{
              background: range === r
                ? 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)'
                : '#f8f8ff',
              color: range === r ? '#fff' : '#818cf8',
              boxShadow: range === r ? '0 2px 8px rgba(99,102,241,0.2)' : 'none',
            }}
          >
            {t(r.toLowerCase())}
          </button>
        ))}
      </motion.div>

      {/* Overview cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { label: t('total'), value: total, color: '#6366f1' },
          { label: t('gotIt'), value: stats.gotIt, color: '#34c759' },
          { label: t('review'), value: stats.notSure + stats.forgot, color: '#ff9f0a' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-[18px] p-3 text-center"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(226,232,255,0.25)',
              boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
            }}
          >
            <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] text-indigo-400/60 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[24px] p-5 mb-5"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-4">{t('distribution')}</div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(226,232,255,0.25)',
                  background: '#ffffff',

                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] text-indigo-400/60 font-medium">{d.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-[24px] p-5"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(226,232,255,0.25)',
          boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
        }}
      >
        <div className="text-[11px] font-bold text-indigo-400/60 uppercase tracking-[0.08em] mb-4">{t('learningTrend')}</div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#a5b4fc' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a5b4fc' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(226,232,255,0.25)',
                  background: '#ffffff',

                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="gotIt" stroke="#34c759" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="notSure" stroke="#ff9f0a" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="forgot" stroke="#ff3b30" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
