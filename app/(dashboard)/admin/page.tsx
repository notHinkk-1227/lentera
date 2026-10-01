import { CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { VerificationQueueList } from "@/components/dashboard/VerificationQueueList";
import { requireRole } from "@/lib/authz";
import { dummyPendingQueue } from "@/lib/dummy-data";

// TODO: ganti dummyPendingQueue dengan articleService.getPendingQueue()
// begitu backend & database aktif — lihat lib/services/articleService.ts.
export default async function AdminQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ reviewed?: string }>;
}) {
  await requireRole("ADMIN");
  const { reviewed } = await searchParams;

  return (
    <div>
      {reviewed === "approved" ? (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-status-published-soft px-4 py-3 text-sm text-status-published">
          <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Artikel disetujui dan dipublikasikan ke halaman publik.
        </div>
      ) : null}
      {reviewed === "rejected" ? (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-status-rejected-soft px-4 py-3 text-sm text-status-rejected">
          <XCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Artikel ditolak, catatan revisi dikirim ke dosen.
        </div>
      ) : null}

      <h1 className="font-serif text-2xl text-ink">Antrean verifikasi</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Tinjau artikel yang diunggah dosen sebelum dipublikasikan ke halaman publik.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Menunggu verifikasi" value={dummyPendingQueue.length} />
      </div>

      <div className="mt-8">
        <VerificationQueueList articles={dummyPendingQueue} />
      </div>
    </div>
  );
}
