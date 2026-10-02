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
      <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {authors.map((author) => {
          const isInternal = author.type !== "EKSTERNAL";
          const subtitle = [AUTHOR_TYPE_LABEL[author.type], author.affiliation].filter(Boolean).join(", ");
          return (
            <li key={`${author.name}-${author.type}`} className="flex items-center gap-3.5">
              <span
                aria-hidden
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isInternal ? "bg-[#E5493A]/20 text-[#FF8A7D]" : "bg-white/10 text-white/60"
                }`}
              >
                {initials(author.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-snug text-white">{author.name}</p>
                <p className="mt-0.5 text-sm leading-snug text-white/50">{subtitle}</p>
                {author.corresponding ? (
                  <p className="mt-1 text-xs text-[#FF8A7D]">Penulis korespondensi</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
