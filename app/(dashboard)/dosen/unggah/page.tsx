import { UploadArticleForm } from "@/components/dashboard/UploadArticleForm";
import { requireRole } from "@/lib/authz";

export default async function UploadArticlePage() {
  await requireRole("DOSEN");

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-ink">Unggah karya baru</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Karya akan berstatus &ldquo;menunggu verifikasi&rdquo; sampai ditinjau oleh admin/pustakawan.
      </p>

      <div className="mt-6">
        <UploadArticleForm />
      </div>
    </div>
  );
}
