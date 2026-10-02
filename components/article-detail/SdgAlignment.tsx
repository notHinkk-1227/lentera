import Image from "next/image";
import { getSdg } from "@/lib/sdg";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Keselarasan karya dengan SDG (FR-NASKAH-08). Memakai ikon resmi SDG PBB dari
// public/images/sdg/sdg-01.png ... sdg-17.png (versi bahasa Inggris, tidak diubah warnanya,
// sesuai pedoman PBB). Nama tujuan dalam bahasa Indonesia ada di tooltip dan teks alt.
export function SdgAlignment({ sdgs }: { sdgs: number[] }) {
  const items = sdgs.map(getSdg).filter((sdg) => sdg !== undefined);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading>Keselarasan SDG</SectionHeading>
      <ul className="mt-3 flex flex-wrap gap-3">
        {items.map((sdg) => (
          <li key={sdg.number} title={`SDG ${sdg.number}: ${sdg.name}`}>
            <Image
              src={`/images/sdg/sdg-${String(sdg.number).padStart(2, "0")}.png`}
              alt={`SDG ${sdg.number}: ${sdg.name}`}
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-md"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
