import { ExternalLink } from "lucide-react";
import { getDoiUrl, getScholarUrl, type PublicArticleDetail } from "@/lib/article-detail";

const LINK_CLASS =
  "inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-2 text-sm text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

// DOI, Scopus, dan SINTA (masing-masing bila ada), serta Google Scholar (selalu ada).
// Karya tanpa DOI/Scopus/SINTA tetap valid (FR-EXT-06); tautan eksternal tidak boleh memengaruhi
// pemuatan halaman (NFR-INT-01), jadi semuanya hanya <a> biasa tanpa fetch.
// Gayanya seragam: semuanya sama-sama tautan keluar, jadi tidak perlu dibedakan warna.
export function ExternalLinks({ article }: { article: PublicArticleDetail }) {
  return (
    <>
      {article.doi ? (
        <a href={getDoiUrl(article.doi)} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          DOI
          <ExternalLink className="h-3.5 w-3.5 text-white/50" strokeWidth={1.75} />
        </a>
      ) : null}
      {article.scopusUrl ? (
        <a href={article.scopusUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          Scopus
          <ExternalLink className="h-3.5 w-3.5 text-white/50" strokeWidth={1.75} />
        </a>
      ) : null}
      {article.sintaUrl ? (
        <a href={article.sintaUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          SINTA
          <ExternalLink className="h-3.5 w-3.5 text-white/50" strokeWidth={1.75} />
        </a>
      ) : null}
      <a href={getScholarUrl(article)} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        Google Scholar
        <ExternalLink className="h-3.5 w-3.5 text-white/50" strokeWidth={1.75} />
      </a>
    </>
  );
}
