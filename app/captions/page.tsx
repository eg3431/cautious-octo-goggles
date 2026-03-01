import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import VoteButtons from "./vote_buttons"
import LogoutButton from "@/app/components/LogoutButton"


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

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Note: Can't set cookies in server components directly
        },
        remove(name: string, options: any) {
          // Note: Can't remove cookies in server components directly
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login?redirect=/captions")
  }

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
  (data ?? []).map((row: any) => ({
    ...row,
    images: Array.isArray(row.images)
      ? row.images[0] ?? null
      : row.images ?? null
  })) as CaptionRow[]
//   const captions =
//     data as CaptionRow[]

  const totalPages =
    Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">
          Rate Captions
        </h1>
        <LogoutButton />
      </div>

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