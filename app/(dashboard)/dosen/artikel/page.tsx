import { ArticleTable } from "@/components/dashboard/ArticleTable";
import { requireRole } from "@/lib/authz";
import { articleService } from "@/lib/services/articleService";

// FR-NASKAH-07: daftar karya milik pengunggah beserta statusnya.
// TODO: tambahkan filter per status.
export default async function MyArticlesPage() {
  const user = await requireRole("DOSEN");
  const { articles } = await articleService.getArticlesByUploader(user.id);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Karya saya</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Seluruh karya yang kamu unggah beserta status verifikasinya.
      </p>

      <div className="mt-6">
        <ArticleTable articles={articles} />
      </div>
    </div>
  );
}
