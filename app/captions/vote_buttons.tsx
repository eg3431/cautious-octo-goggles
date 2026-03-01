'use client'

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

async function vote(value: number) {

  const {
    data: { user }
  } =
    await supabase.auth.getUser()

  if (!user) {
    alert("Login required")
    return
  }

  const now =
    new Date().toISOString()

  const { error } =
    await supabase
      .from("caption_votes")
      .upsert({
        caption_id: captionId,
        profile_id: user.id,
        vote_value: value,
        created_datetime_utc: now,
        modified_datetime_utc: now
      }, {
        onConflict: 'caption_id,profile_id'
      })

  if (error)
    alert(error.message)
  else
    alert("Vote saved")
}



  return (
    <div className="flex gap-4">
      <button
        onClick={() => vote(1)}
        className="flex-1 bg-gradient-to-br from-rose-400 via-rose-500 to-red-500 hover:from-rose-500 hover:via-rose-600 hover:to-red-600 text-white font-black px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-110 transition-all duration-200 border-2 border-rose-700 active:scale-95 relative overflow-hidden"
      >
        <span className="relative z-10">♡ LOVE</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"></div>
      </button>

      <button
        onClick={() => vote(-1)}
        className="flex-1 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700 text-white font-black px-8 py-4 rounded-full text-lg shadow-lg transform hover:scale-110 transition-all duration-200 border-2 border-slate-700 active:scale-95"
      >
        ✦ PASS
      </button>
    </div>
  )
}