'use client'

import React from 'react'

import { createBrowserClient }
from '@supabase/ssr'

export default function VoteButtons({
  captionId
}: {
  captionId: string
}) {
  const supabase =
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

  const [submitting, setSubmitting] = React.useState(false)
  const [status, setStatus] = React.useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  async function vote(value: number) {
    if (submitting) return
    setSubmitting(true)
    setStatus({ type: null, message: '' })

  const {
    data: { user }
  } =
    await supabase.auth.getUser()

  if (!user) {
    setStatus({ type: 'error', message: 'Please log in to vote.' })
    setSubmitting(false)
    return
  }

    const now = new Date().toISOString()

    try {
      const { error } = await supabase
        .from('caption_votes')
        .upsert(
          {
            caption_id: captionId,
            profile_id: user.id,
            vote_value: value,
            created_datetime_utc: now,
            modified_datetime_utc: now,
          },
          { onConflict: ['caption_id', 'profile_id'] }
        )

      if (error) throw error

      setStatus({
        type: 'success',
        message: value > 0 ? 'Saved: you loved this caption.' : 'Saved: you passed this caption.'
      })
    } catch (e: unknown) {
      setStatus({
        type: 'error',
        message: e instanceof Error ? e.message : 'Failed to save vote'
      })
    } finally {
      setSubmitting(false)
    }
}



  return (
    <div className="w-full">
      <div className="flex gap-4">
      <button
        onClick={() => vote(1)}
        disabled={submitting}
        aria-pressed={false}
        className="flex-1 bg-gradient-to-br from-rose-400 via-rose-500 to-red-500 hover:from-rose-500 hover:via-rose-600 hover:to-red-600 text-white font-black px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-110 transition-all duration-200 border-2 border-rose-700 active:scale-95 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10">{submitting ? 'Saving...' : '♡ LOVE'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"></div>
      </button>

      <button
        onClick={() => vote(-1)}
        disabled={submitting}
        aria-pressed={false}
        className="flex-1 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700 text-white font-black px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-110 transition-all duration-200 border-2 border-slate-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving...' : '✦ PASS'}
      </button>
    </div>

      {status.type && (
        <p
          role="status"
          className={`mt-3 text-center text-sm font-bold ${
            status.type === 'success' ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  )
}