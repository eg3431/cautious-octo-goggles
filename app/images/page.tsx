import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

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
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        Images (page {page} / {totalPages || 1})
      </h1>

      <table className="w-full border border-gray-700 text-sm text-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2">Preview</th>
            <th className="border p-2">ID</th>
            <th className="border p-2">Public</th>
            <th className="border p-2">Common</th>
            <th className="border p-2">Created</th>
            <th className="border p-2">Modified</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Context</th>
            <th className="border p-2">Celebrity</th>
            <th className="border p-2">Profile</th>
          </tr>
        </thead>

        <tbody>
          {images.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center p-6 text-gray-400">
                No images found
              </td>
            </tr>
          )}

          {images.map((img) => (
            <tr
              key={img.id ?? ""}
              className="odd:bg-gray-900 even:bg-gray-800"
            >
              {/* preview */}
              <td className="border p-2">
                <img
                  src={img.url || "/placeholder.png"}
                  className="w-16 h-16 object-cover rounded bg-gray-700"
                  alt=""
                />
              </td>

              {/* id */}
              <td className="border p-2 text-xs break-all">
                {img.id ?? ""}
              </td>

              {/* public */}
              <td className="border p-2 text-center">
                {img.is_public ? "✅" : "❌"}
              </td>

              {/* common use */}
              <td className="border p-2 text-center">
                {img.is_common_use ? "⭐" : ""}
              </td>

              {/* created */}
              <td className="border p-2 text-xs">
                {fmt(img.created_datetime_utc)}
              </td>

              {/* modified */}
              <td className="border p-2 text-xs">
                {fmt(img.modified_datetime_utc)}
              </td>

              {/* description */}
              <td className="border p-2 max-w-xs truncate">
                {img.image_description ?? ""}
              </td>

              {/* additional context */}
              <td className="border p-2 max-w-xs truncate">
                {img.additional_context ?? ""}
              </td>

              {/* celebrity */}
              <td className="border p-2 max-w-xs truncate">
                {img.celebrity_recognition ?? ""}
              </td>

              {/* profile */}
              <td className="border p-2 text-xs break-all">
                {img.profile_id ?? ""}
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
