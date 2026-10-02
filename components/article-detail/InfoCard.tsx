import { WORK_TYPE_LABEL, type PublicArticleDetail } from "@/lib/dummy-article-detail";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Ringkasan fakta karya di sidebar. Tanpa kotak sendiri: sidebar sudah berada di dalam
// panel utama, jadi cukup daftar label-nilai dengan garis tipis.
export function InfoCard({ article }: { article: PublicArticleDetail }) {
  const facts = [
    { label: "Tipe karya", value: WORK_TYPE_LABEL[article.type] },
    { label: "Tahun", value: String(article.year) },
    { label: "Fakultas", value: article.facultyName },
    { label: "Kategori", value: article.categoryName },
    { label: "Terbit di LENTERA", value: formatDate(article.publishedAt) },
    { label: "Diunduh", value: `${article.downloadCount.toLocaleString("id-ID")} kali` },
  ];

  return (
    <section>
      <h2 className="text-base font-semibold text-white">Informasi karya</h2>
      <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {facts.map(({ label, value }) => (
          <div key={label} className="py-3">
            <dt className="text-xs text-white/50">{label}</dt>
            <dd className="mt-0.5 text-sm text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
