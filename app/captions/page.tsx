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
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 p-8">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 text-6xl opacity-20 pointer-events-none">🌸</div>
      <div className="fixed bottom-0 right-0 text-6xl opacity-20 pointer-events-none">✦</div>
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text mb-2">
              ♡ キャプション ♡
            </h1>
            <p className="text-lg text-purple-800 font-bold tracking-widest">~ love or pass ~</p>
            <p className="text-sm text-purple-700 mt-1">彼らのストーリーを評価します</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-indigo-700 text-sm"
            >
              ♡ HOME
            </a>
            <LogoutButton />
          </div>
        </div>

        {/* Caption Cards */}
        <div className="space-y-8">
          {captions.map(caption => (
            <div
              key={caption.id}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-rose-300 relative group"
              style={{
                boxShadow: '0 15px 35px rgba(219, 39, 119, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)'
              }}
            >
              {/* Ornate corner decorations */}
              <div className="absolute top-3 left-3 text-2xl opacity-70">✦</div>
              <div className="absolute top-3 right-3 text-2xl opacity-70">✦</div>
              
              {/* CHARACTER IMAGE FRAME */}
              {caption.images?.url && (
                <div className="relative overflow-hidden h-96 bg-gradient-to-b from-purple-100 to-rose-50">
                  <img
                    src={caption.images.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-200 opacity-30"></div>
                  
                  {/* Rose frame border effect */}
                  <div className="absolute inset-0 border-8 border-rose-300 opacity-30 pointer-events-none"></div>
                </div>
              )}

              {/* CHARACTER QUOTE/CAPTION */}
              <div className="p-8 bg-gradient-to-b from-white to-rose-50">
                <div className="mb-6">
                  <p className="text-center text-sm text-purple-600 font-bold mb-2">━━━━━✦━━━━━</p>
                  <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text italic leading-relaxed text-center">
                    "{caption.content}"
                  </p>
                  <p className="text-center text-sm text-purple-600 font-bold mt-2">━━━━━✦━━━━━</p>
                </div>

                {/* AFFECTION BUTTONS */}
                <div className="flex gap-4 justify-center">
                  <VoteButtons captionId={caption.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination with Japanese aesthetic */}
        <div className="flex justify-between items-center mt-12 mb-8">
          {page > 1 ? (
            <a 
              href={`/captions?page=${page - 1}`}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200 border-2 border-indigo-700 text-lg"
            >
              ← PREV
            </a>
          ) : (
            <div />
          )}

          <div className="text-center">
            <p className="text-purple-700 font-bold text-sm mb-1">第 {page} 章 / {totalPages || 1}</p>
            <span className="text-2xl font-black text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text">
              {page} / {totalPages || 1}
            </span>
          </div>

          {page < totalPages ? (
            <a 
              href={`/captions?page=${page + 1}`}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-rose-500 text-white font-black rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200 border-2 border-rose-700 text-lg"
            >
              NEXT →
            </a>
          ) : (
            <div />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-purple-800 font-bold text-lg">~ 彼らのストーリーを感じてください ~</p>
          <p className="text-purple-700 text-sm">Feel their stories through your choices...</p>
          <p className="text-2xl">♡ ✦ ♡</p>
        </div>
      </div>
    </main>
  )
}