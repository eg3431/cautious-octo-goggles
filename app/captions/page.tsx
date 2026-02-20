import { supabase } from "@/lib/supabaseClient"
import { redirect } from "next/navigation"
import VoteButtons from "./vote_buttons"


const PAGE_SIZE = 20
//
// type CaptionRow = {
//   id: string
//   content: string | null
//   created_datetime_utc: string | null
//   images: {
//     url: string | null
//   } | null
// }
type CaptionRow = {
  id: string
  content: string | null
  created_datetime_utc: string | null
images: {
  url: string | null
} | null
}
export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {

  const params = await searchParams

  if (!params.page) {
    redirect("/captions?page=1")
  }

  const page =
    Math.max(1, Number(params.page) || 1)

  const from =
    (page - 1) * PAGE_SIZE

  const to =
    from + PAGE_SIZE - 1

  const {
    data,
    count,
    error
  } =
    await supabase
      .from("captions")
      .select(`
        id,
        content,
        created_datetime_utc,
        images (
          url
        )
      `, { count: "exact" })
      .order("created_datetime_utc", { ascending: false })
      .range(from, to)

  if (error) {
    return <div>{error.message}</div>
  }

  const captions =
    data as CaptionRow[]

  const totalPages =
    Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <main className="p-8 max-w-3xl mx-auto">

      <h1 className="text-xl font-bold mb-6">
        Rate Captions
      </h1>

      {captions.map(caption => (

        <div
          key={caption.id}
          className="border p-4 mb-6 rounded"
        >

          {/* IMAGE */}
          {caption.images?.url && (
            <img
              src={caption.images.url}
              className="w-full mb-3 rounded"
            />
          )}

          {/* CAPTION TEXT */}
          <p className="mb-3">
            {caption.content}
          </p>

          {/* VOTE BUTTONS */}
          <VoteButtons captionId={caption.id} />

        </div>

      ))}

      <div className="flex justify-between">

        {page > 1 &&
          <a href={`/captions?page=${page - 1}`}>
            ← Prev
          </a>
        }

        {page < totalPages &&
          <a href={`/captions?page=${page + 1}`}>
            Next →
          </a>
        }

      </div>

    </main>
  )
}