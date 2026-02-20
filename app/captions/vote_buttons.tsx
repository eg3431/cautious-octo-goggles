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
      })

  if (error)
    alert(error.message)
  else
    alert("Vote saved")
}



  return (
    <div className="flex gap-2">

      <button
        onClick={() => vote(1)}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Upvote
      </button>

      <button
        onClick={() => vote(-1)}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Downvote
      </button>

    </div>
  )
}