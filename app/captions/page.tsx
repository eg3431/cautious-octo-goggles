import { supabase } from '@/lib/supabaseClient'

const PAGE_SIZE = 10;

type Caption = {
  id: string;
  content: string | null;
  like_count: number | null;
  created_datetime_utc: string | null;
  is_featured: boolean | null;
};

async function getCaptions(page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("captions")
    .select("*")
    .order("created_datetime_utc", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 0);

  const captions = await getCaptions(page);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Captions</h1>

      {/* captions list */}
      {captions.length === 0 && (
        <div className="text-gray-400">No captions found</div>
      )}

      {captions.map((c) => (
        <div
          key={c.id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <p>{c.content ?? ""}</p>

          <div className="text-sm text-gray-500 mt-2 flex gap-4">
            <span>❤️ {c.like_count ?? 0}</span>
            <span>
              {c.created_datetime_utc
                ? new Date(c.created_datetime_utc).toLocaleString()
                : ""}
            </span>
            {c.is_featured && <span>⭐ Featured</span>}
          </div>
        </div>
      ))}

      {/* pagination controls */}
      <div className="flex justify-between pt-6">
        {page > 0 ? (
          <a href={`/captions?page=${page - 1}`} className="underline">
            ← Prev
          </a>
        ) : (
          <span />
        )}

        <a href={`/captions?page=${page + 1}`} className="underline">
          Next →
        </a>
      </div>
    </div>
  );
}
