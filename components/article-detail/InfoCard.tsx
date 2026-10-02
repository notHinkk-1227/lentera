import { Building2, Calendar, CalendarCheck, Download, FileText, Tag } from "lucide-react";
import { WORK_TYPE_LABEL, type PublicArticleDetail } from "@/lib/dummy-article-detail";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Ringkasan fakta karya di sidebar (pengganti kartu "Metrics" di referensi).
export function InfoCard({ article }: { article: PublicArticleDetail }) {
  const facts = [
    { icon: FileText, label: "Tipe karya", value: WORK_TYPE_LABEL[article.type] },
    { icon: Calendar, label: "Tahun", value: String(article.year) },
    { icon: Building2, label: "Fakultas", value: article.facultyName },
    { icon: Tag, label: "Kategori", value: article.categoryName },
    { icon: CalendarCheck, label: "Terbit di LENTERA", value: formatDate(article.publishedAt) },
    { icon: Download, label: "Unduhan", value: `${article.downloadCount}×` },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#181818] p-5">
      <h2 className="text-base font-semibold text-white">Informasi karya</h2>
      <dl className="mt-4 flex flex-col divide-y divide-white/10">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
            <div className="min-w-0">
              <dt className="text-xs text-white/50">{label}</dt>
              <dd className="mt-0.5 text-sm text-white">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
