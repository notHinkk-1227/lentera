import { ExternalLink } from "lucide-react";
import { getDoiUrl, getScholarUrl, type PublicArticleDetail } from "@/lib/dummy-article-detail";

const LINK_CLASS =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

// DOI (bila ada), tombol Scopus (bila ada), dan tombol Google Scholar (selalu ada).
// Karya tanpa DOI/Scopus tetap valid (FR-EXT-06); tautan eksternal tidak boleh memengaruhi
// pemuatan halaman (NFR-INT-01), jadi semuanya hanya <a> biasa tanpa fetch.
export function ExternalLinks({ article }: { article: PublicArticleDetail }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {article.doi ? (
        <a
          href={getDoiUrl(article.doi)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK_CLASS} border border-sky-400/30 text-sky-300`}
        >
          DOI: {article.doi}
          <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
        </a>
      ) : null}
      {article.scopusUrl ? (
        <a
          href={article.scopusUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK_CLASS} bg-orange-500/15 text-orange-300`}
        >
          Lihat di Scopus
          <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
        </a>
      ) : null}
      <a
        href={getScholarUrl(article)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${LINK_CLASS} bg-white/10 text-white/80`}
      >
        Cari di Google Scholar
        <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
      </a>
    </div>
  );
}
