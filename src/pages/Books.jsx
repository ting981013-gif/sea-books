import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import defaultBooks from '../data/books'
import glossary from '../data/glossary'
import { parsePDF, extractTerms } from '../utils/pdfParser'

export default function Books({ store }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const customBooks = store.state.customBooks || []
  const allBooks = [...defaultBooks, ...customBooks]

  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success' | 'error', message: string }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadStatus(null)

    try {
      setUploadStatus({ type: 'info', message: 'Parsing PDF...' })
      const text = await parsePDF(file)

      setUploadStatus({ type: 'info', message: 'Extracting terms...' })
      const terms = extractTerms(text)

      if (terms.length === 0) {
        setUploadStatus({ type: 'error', message: 'No vocabulary terms found in this PDF.' })
        setUploading(false)
        return
      }

      const book = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.pdf$/i, ''),
        subtitle: `${terms.length} terms extracted`,
        totalTerms: terms.length,
        terms,
        isCustom: true,
      }

      store.addCustomBook(book)
      setUploadStatus({ type: 'success', message: `Added "${book.title}" with ${terms.length} terms!` })

      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(null), 4000)
    } catch (err) {
      console.error(err)
      setUploadStatus({ type: 'error', message: 'Failed to parse PDF. Make sure it is text-based.' })
    } finally {
      setUploading(false)
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ''
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
        <h1 className="text-lg font-bold text-indigo-950">My Books</h1>
      </motion.div>

      <div className="space-y-3">
        {allBooks.map((book, i) => {
          const totalTerms = book.totalTerms || glossary.length
          const studied = store.state.memory.gotIt.length + store.state.memory.notSure.length + store.state.memory.forgot.length
          const pct = Math.round((studied / totalTerms) * 100)

          return (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/books/${book.id}`)}
              className="w-full text-left active:scale-[0.98] transition-all"
            >
              <div
                className="rounded-[20px] p-4 flex items-start gap-3.5"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(226,232,255,0.25)',
                  boxShadow: '0 1px 3px rgba(99,102,241,0.04)',
                }}
              >
                {/* Book cover placeholder */}
                <div
                  className="w-14 h-[72px] rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: book.isCustom
                      ? 'linear-gradient(135deg, rgba(52,199,89,0.15) 0%, rgba(52,199,89,0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(167,139,250,0.1) 100%)',
                    border: '1px solid rgba(226,232,255,0.25)',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.08)',
                  }}
                >
                  {book.isCustom ? '📄' : '📘'}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="text-[15px] font-bold text-indigo-950 truncate">{book.title}</div>
                  <div className="text-[12px] text-indigo-400/60 font-medium mt-0.5">{book.subtitle}</div>
                  <div className="flex items-center gap-2.5 mt-3">
                    <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(226,232,255,0.5)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #818cf8 0%, #a78bfa 100%)',
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-indigo-400/50 font-medium shrink-0">{totalTerms} terms</span>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-indigo-300/40 shrink-0 mt-1">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Upload status */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-[16px] p-3.5 text-[13px] font-medium text-center"
            style={{
              background: uploadStatus.type === 'success'
                ? 'linear-gradient(135deg, rgba(52,199,89,0.12) 0%, rgba(52,199,89,0.06) 100%)'
                : uploadStatus.type === 'error'
                ? 'linear-gradient(135deg, rgba(255,59,48,0.12) 0%, rgba(255,59,48,0.06) 100%)'
                : 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(167,139,250,0.06) 100%)',
              border: '1px solid rgba(226,232,255,0.2)',
              color: uploadStatus.type === 'success' ? '#34c759' : uploadStatus.type === 'error' ? '#ff3b30' : '#6366f1',
            }}
          >
            {uploadStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleUploadClick}
        disabled={uploading}
        className="w-full mt-4 py-3.5 rounded-[18px] text-[14px] font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(99,102,241,0.2)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        {uploading ? 'Parsing PDF...' : 'Upload PDF Book'}
      </motion.button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 space-y-1.5"
      >
        <div className="text-[11px] text-indigo-400/50 font-medium">Tips:</div>
        <div className="text-[11px] text-indigo-400/40 font-medium space-y-1">
          <div>• The PDF should be text-based (not scanned images)</div>
          <div>• Each page will be processed to extract vocabulary</div>
          <div>• We'll extract words and phrases for you</div>
        </div>
      </motion.div>
    </div>
  )
}
