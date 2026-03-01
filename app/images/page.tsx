import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LogoutButton from "@/app/components/LogoutButton"

const PAGE_SIZE = 20;

type ImageRow = {
  id: string | null;
  url: string | null;
  is_public: boolean | null;
  is_common_use: boolean | null;
  profile_id: string | null;
  additional_context: string | null;
  image_description: string | null;
  celebrity_recognition: string | null;
  created_datetime_utc: string | null;
  modified_datetime_utc: string | null;
};

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
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
    redirect("/login?redirect=/images")
  }

  const params = await searchParams;

  // redirect /images → page 1
  if (!params.page) {
    redirect("/images?page=1");
  }

  const page = Math.max(1, Number(params.page) || 1);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ✅ ONLY select real + needed columns (avoid embedding!)
  const { data, count, error } = await supabase
    .from("images")
    .select(
      `
      id,
      url,
      is_public,
      is_common_use,
      profile_id,
      additional_context,
      image_description,
      celebrity_recognition,
      created_datetime_utc,
      modified_datetime_utc
      `,
      { count: "exact" }
    )
    .order("created_datetime_utc", { ascending: false })
    .range(from, to);

  if (error) {
    return (
      <main className="p-8 text-red-500">
        Error: {error.message}
      </main>
    );
  }

  const images = (data ?? []) as ImageRow[];

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // if user enters huge page number → clamp
  if (page > totalPages && totalPages > 0) {
    redirect(`/images?page=${totalPages}`);
  }

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString() : "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 p-8">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 text-6xl opacity-20 pointer-events-none">🌸</div>
      <div className="fixed bottom-0 right-0 text-6xl opacity-20 pointer-events-none">✦</div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text mb-2">
              ♡ Image Gallery ♡
            </h1>
            <p className="text-lg text-purple-800 font-bold tracking-widest">~ browse all images ~</p>
            <p className="text-sm text-purple-700 mt-1">すべての画像を見る</p>
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

        {/* Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {images.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white rounded-2xl border-2 border-purple-300">
              <p className="text-2xl text-purple-700 font-bold">✦ No images found ✦</p>
            </div>
          ) : (
            images.map((img) => (
              <div
                key={img.id ?? ""}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-4 border-rose-300 group"
                style={{
                  boxShadow: '0 15px 35px rgba(219, 39, 119, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)'
                }}
              >
                {/* Ornate corners */}
                <div className="absolute top-3 left-3 text-xl opacity-70 z-10">✦</div>
                <div className="absolute top-3 right-3 text-xl opacity-70 z-10">✦</div>

                {/* Image */}
                <div className="relative overflow-hidden h-48 bg-gradient-to-b from-purple-100 to-rose-50">
                  <img
                    src={img.url || "/placeholder.png"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-200 opacity-20"></div>
                </div>

                {/* Info Section */}
                <div className="p-6 bg-gradient-to-b from-white to-rose-50">
                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4 justify-center">
                    {img.is_public && (
                      <span className="px-3 py-1 bg-gradient-to-r from-green-200 to-green-300 text-green-700 text-xs font-bold rounded-full border border-green-500">
                        ✓ Public
                      </span>
                    )}
                    {img.is_common_use && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 text-xs font-bold rounded-full border border-yellow-500">
                        ⭐ Common
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {img.image_description && (
                    <p className="text-sm text-purple-700 font-semibold mb-3 line-clamp-2">
                      {img.image_description}
                    </p>
                  )}

                  {/* Context */}
                  {img.additional_context && (
                    <p className="text-xs text-purple-600 mb-3 line-clamp-1">
                      {img.additional_context}
                    </p>
                  )}

                  {/* Dates */}
                  <div className="text-xs text-purple-600 space-y-1 pt-3 border-t border-rose-200">
                    <p>Created: {fmt(img.created_datetime_utc)}</p>
                    {img.modified_datetime_utc && (
                      <p>Modified: {fmt(img.modified_datetime_utc)}</p>
                    )}
                  </div>

                  {/* ID (hidden but available) */}
                  <p className="text-xs text-gray-400 mt-2 break-all font-mono">
                    ID: {img.id?.substring(0, 12)}...
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center gap-4">
          {page > 1 ? (
            <a
              href={`/images?page=${page - 1}`}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200 border-2 border-indigo-700 text-lg"
            >
              ← PREV
            </a>
          ) : (
            <div />
          )}

          <div className="text-center">
            <p className="text-purple-700 font-bold text-sm mb-1">第 {page} 頁 / {totalPages || 1}</p>
            <span className="text-2xl font-black text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text">
              {page} / {totalPages || 1}
            </span>
          </div>

          {page < totalPages ? (
            <a
              href={`/images?page=${page + 1}`}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-rose-500 text-white font-black rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-200 border-2 border-rose-700 text-lg"
            >
              NEXT →
            </a>
          ) : (
            <div />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-purple-800 font-bold text-lg">~ 画像を見る ~</p>
          <p className="text-purple-700 text-sm">Explore all uploaded images...</p>
        </div>
      </div>
    </main>
  );
}
