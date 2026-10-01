import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ArticleTable } from "@/components/dashboard/ArticleTable";
import { requireRole } from "@/lib/authz";
import { dummyArticles, getDummyStats } from "@/lib/dummy-data";

// TODO: ganti dummyArticles dengan articleService.getArticlesByAuthor(session.user.id)
// begitu NextAuth session dan database aktif.
export default async function DosenDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await requireRole("DOSEN");
  const { submitted } = await searchParams;
  const stats = getDummyStats(dummyArticles);

  return (
    <div>
      {submitted ? (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-status-published-soft px-4 py-3 text-sm text-status-published">
          <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Karya berhasil dikirim dan sedang menunggu verifikasi admin.
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">Selamat datang kembali,</p>
          <h1 className="mt-1 font-serif text-2xl text-ink">{user.name}</h1>
        </div>
        <Link
          href="/dosen/unggah"
          className="shrink-0 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Unggah karya baru
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total karya" value={stats.total} />
        <StatCard
          label="Dipublikasikan"
          value={stats.published}
          helper={`${stats.total - stats.published} lainnya belum tayang`}
        />
        <StatCard label="Menunggu verifikasi" value={stats.pending} />
        <StatCard label="Total unduhan" value={stats.totalDownloads} />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-lg text-ink">Karya saya</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Status terbaru dari setiap karya ilmiah yang kamu unggah.
        </p>
        <div className="mt-4">
          <ArticleTable articles={dummyArticles} />
        </div>
      </div>
    </div>
  );
}
