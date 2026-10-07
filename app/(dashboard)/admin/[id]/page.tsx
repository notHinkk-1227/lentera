import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleCover } from "@/components/public/ArticleCover";
import { PdfPreviewPlaceholder } from "@/components/dashboard/PdfPreviewPlaceholder";
import { ArticleReviewActions } from "@/components/dashboard/ArticleReviewActions";
import { requireRole } from "@/lib/authz";
import { articleService } from "@/lib/services/articleService";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminArticleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const article = await articleService.getArticleForReview(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Kembali ke antrean
      </Link>

      <div className="mt-4 flex gap-6">
        <div className="w-[150px] shrink-0">
          <ArticleCover title={article.title} theme={article.coverTheme} size="lg" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl leading-snug text-ink">{article.title}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {article.authorName} · {article.facultyName} · {article.year}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Diajukan {formatDate(article.submittedAt)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-ink-soft"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-serif text-lg text-ink">Abstrak</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{article.abstract}</p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-serif text-lg text-ink">Berkas artikel</h2>
        <div className="mt-3">
          <PdfPreviewPlaceholder fileName={`${article.title.slice(0, 40)}...pdf`} />
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <ArticleReviewActions articleId={article.id} />
      </div>
    </div>
  );
}
