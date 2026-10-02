import { AUTHOR_TYPE_LABEL, type DetailAuthor } from "@/lib/dummy-article-detail";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Inisial untuk avatar: gelar (Prof., Dr., Ir., dst.) dibuang supaya "Dr. Andi Wijaya" jadi "AW".
function initials(name: string) {
  const words = name
    .split(/\s+/)
    .filter((word) => word && !/\.$/.test(word) && !/^(prof|dr|ir)$/i.test(word));
  return (words.length > 0 ? words : [name]).slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
}

// Penulis tampil berurutan sesuai input (FR-NASKAH-09). Penulis internal (dosen/mahasiswa)
// diberi avatar beraksen; penulis eksternal berwarna netral.
// TODO: setelah MAESTRO (/maestro/[slug]) ada, penulis DOSEN yang profilnya publik menaut ke
// profilnya (FR-MAE-11).
export function AuthorChips({ authors }: { authors: DetailAuthor[] }) {
  return (
    <section>
      <SectionHeading>Penulis</SectionHeading>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {authors.map((author) => {
          const isInternal = author.type !== "EKSTERNAL";
          const subtitle = [AUTHOR_TYPE_LABEL[author.type], author.affiliation].filter(Boolean).join(" · ");
          return (
            <li
              key={`${author.name}-${author.type}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <span
                aria-hidden
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isInternal ? "bg-[#E5493A]/20 text-[#FF8A7D]" : "bg-white/10 text-white/60"
                }`}
              >
                {initials(author.name)}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 text-sm font-medium text-white">
                  {author.name}
                  {author.corresponding ? (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal text-white/60">
                      Korespondensi
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-white/50" title={subtitle}>
                  {subtitle}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
