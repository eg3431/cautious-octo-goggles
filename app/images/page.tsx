import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

const PAGE_SIZE = 20;

type ImageRow = {
  id: string | null;
  url: string | null;
  profile_id: string | null;
  is_public: boolean | null;
  image_description: string | null;
};

export default async function ImagesPage({
  searchParams,
}: {
  // ✅ Next 15: searchParams is a Promise
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  // ✅ redirect /images → first page
  if (!params.page) {
    redirect("/images?page=1");
  }

  const page = Math.max(1, Number(params.page) || 1);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("images")
    .select(
      `
      id,
      url,
      profile_id,
      is_public,
      image_description
      `,
      { count: "exact" }
    )
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

  // ✅ if user manually types huge page → redirect to last page
  if (page > totalPages && totalPages > 0) {
    redirect(`/images?page=${totalPages}`);
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        Images (page {page} / {totalPages || 1})
      </h1>

      <table className="w-full border border-gray-700 text-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2">Preview</th>
            <th className="border p-2">ID</th>
            <th className="border p-2">Public</th>
          </tr>
        </thead>

<tbody>
  {images.length === 0 && (
    <tr>
      <td colSpan={3} className="text-center p-6 text-gray-400">
        No images found
      </td>
    </tr>
  )}

  {images.map((img) => (
    <tr key={img.id ?? ""} className="odd:bg-gray-900 even:bg-gray-800">
      <td className="border p-2">
        <img
          src={img.url || "/placeholder.png"}
          className="w-16 h-16 object-cover rounded bg-gray-700"
          alt=""
        />
      </td>
      <td className="border p-2 text-xs">{img.id ?? ""}</td>
      <td className="border p-2 text-center">
        {img.is_public ? "✅" : "❌"}
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* pagination */}
      <div className="mt-6 flex justify-between">
        {page > 1 ? (
          <a href={`/images?page=${page - 1}`} className="underline">
            ← Prev
          </a>
        ) : (
          <span />
        )}

        {page < totalPages && (
          <a href={`/images?page=${page + 1}`} className="underline">
            Next →
          </a>
        )}
      </div>
    </main>
  );
}
