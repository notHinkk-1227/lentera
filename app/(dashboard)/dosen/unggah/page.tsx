import { UploadArticleForm } from "@/components/dashboard/UploadArticleForm";
import { requireRole } from "@/lib/authz";
import { articleService } from "@/lib/services/articleService";

export default async function UploadArticlePage() {
  const user = await requireRole("DOSEN");
  const { facultyName, categories } = await articleService.getUploadFormOptions(user.id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-ink">Unggah karya baru</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Karya akan berstatus &ldquo;menunggu verifikasi&rdquo; sampai ditinjau oleh admin/pustakawan.
      </p>

      <div className="mt-6">
        <UploadArticleForm facultyName={facultyName} categories={categories} />
      </div>
    </div>
  );
}
