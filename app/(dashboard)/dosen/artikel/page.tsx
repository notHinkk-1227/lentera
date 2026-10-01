import { ArticleTable } from "@/components/dashboard/ArticleTable";
import { requireRole } from "@/lib/authz";
import { dummyArticles } from "@/lib/dummy-data";

// FR-NASKAH-07: daftar karya milik pengunggah beserta statusnya.
// TODO: ganti dummyArticles dengan articleService.getArticlesByAuthor(user.id)
// dan tambahkan filter per status begitu database aktif.
export default async function MyArticlesPage() {
  await requireRole("DOSEN");

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Karya saya</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Seluruh karya yang kamu unggah beserta status verifikasinya.
      </p>

      <div className="mt-6">
        <ArticleTable articles={dummyArticles} />
      </div>
    </div>
  );
}
