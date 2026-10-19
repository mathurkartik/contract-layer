'use client'

import { useState } from 'react'
import { MessageCircle, Star, X } from 'lucide-react'

interface FeedbackEntry {
  timestamp: string
  rating: number
  tags: string[]
  comment: string
}

const FEEDBACK_KEY = 'cl_feedback'

function storeFeedback(entry: FeedbackEntry) {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    const existing: FeedbackEntry[] = raw ? JSON.parse(raw) : []
    existing.push(entry)
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing))
  } catch {}
}

function loadFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY)
    if (raw) return JSON.parse(raw) as FeedbackEntry[]
  } catch {}
  return []
}

const TAG_OPTIONS = [
  'Schedule was clear',
  'Compliance section was useful',
  "I'd use this for real contracts",
]

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = () => {
    if (rating === 0) return
    storeFeedback({
      timestamp: new Date().toISOString(),
      rating,
      tags,
      comment,
    })
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setRating(0)
      setHoverRating(0)
      setTags([])
      setComment('')
    }, 1500)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm font-medium"
      >
        <MessageCircle className="w-4 h-4" />
        Was this helpful?
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-3xl">&#10003;</div>
                <p className="text-sm font-semibold text-foreground">Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Share Your Feedback</h3>
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">How would you rate this tool?</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            n <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">What worked well?</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          tags.includes(tag)
                            ? 'bg-accent text-accent-foreground border-accent'
                            : 'bg-white text-foreground border-border hover:border-accent/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Any additional comments?
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    placeholder="Tell us what you think..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="w-full py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export function FeedbackSummary() {
  if (process.env.NODE_ENV !== 'development') return null

  const feedback = loadFeedback()
  if (feedback.length === 0) return null

  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
  const tagCounts: Record<string, number> = {}
  feedback.forEach((f) => f.tags.forEach((t) => {
    tagCounts[t] = (tagCounts[t] || 0) + 1
  }))

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <h4 className="text-xs font-bold text-foreground">Feedback Summary (Dev)</h4>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">Total Responses:</span>
          <span className="ml-2 font-semibold text-foreground">{feedback.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Rating:</span>
          <span className="ml-2 font-semibold text-foreground">{avgRating.toFixed(1)} / 5</span>
        </div>
      </div>
      {Object.keys(tagCounts).length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Tag Breakdown:</p>
          {Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([tag, count]) => (
              <div key={tag} className="flex justify-between text-xs">
                <span className="text-foreground">{tag}</span>
                <span className="text-muted-foreground">{count}x</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
