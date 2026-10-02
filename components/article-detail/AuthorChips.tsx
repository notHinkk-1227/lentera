import { AUTHOR_TYPE_LABEL, type DetailAuthor } from "@/lib/dummy-article-detail";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Penulis tampil sebagai chip, berurutan sesuai input (FR-NASKAH-09). Penulis internal
// (dosen/mahasiswa) diberi warna aksen; penulis eksternal berupa teks biasa.
// TODO: setelah MAESTRO (/maestro/[slug]) ada, penulis DOSEN yang profilnya publik menaut ke
// profilnya (FR-MAE-11).
export function AuthorChips({ authors }: { authors: DetailAuthor[] }) {
  return (
    <section>
      <SectionHeading>Penulis</SectionHeading>
      <ul className="mt-3 flex flex-wrap gap-2">
        {authors.map((author) => {
          const isInternal = author.type !== "EKSTERNAL";
          const tooltip = [AUTHOR_TYPE_LABEL[author.type], author.affiliation].filter(Boolean).join(" · ");
          return (
            <li
              key={`${author.name}-${author.type}`}
              title={tooltip}
              className={`rounded-full border px-3.5 py-1.5 text-sm ${
                isInternal
                  ? "border-[#E5493A]/40 bg-[#E5493A]/10 text-white"
                  : "border-white/15 bg-white/5 text-white/70"
              }`}
            >
              {author.name}
              {author.corresponding ? (
                <span className="ml-1.5 text-xs text-white/50" title="Penulis korespondensi">
                  ✉
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-white/40">
        Ditandai warna: penulis internal Universitas Widyatama. ✉ = penulis korespondensi.
      </p>
    </section>
  );
}
