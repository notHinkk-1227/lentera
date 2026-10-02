import Image from "next/image";
import { getSdg } from "@/lib/sdg";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Keselarasan karya dengan SDG (FR-NASKAH-08). Memakai ikon resmi SDG PBB dari
// public/images/sdg/sdg-01.png ... sdg-17.png (versi bahasa Inggris, tidak diubah warnanya,
// sesuai pedoman PBB). Nama pendek dalam bahasa Indonesia ditaruh di bawah ikon.
export function SdgAlignment({ sdgs }: { sdgs: number[] }) {
  const items = sdgs.map(getSdg).filter((sdg) => sdg !== undefined);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading>Keselarasan SDG</SectionHeading>
      <ul className="mt-4 flex flex-wrap gap-4">
        {items.map((sdg) => (
          <li key={sdg.number} title={`SDG ${sdg.number}: ${sdg.name}`} className="w-24">
            <Image
              src={`/images/sdg/sdg-${String(sdg.number).padStart(2, "0")}.png`}
              alt={`SDG ${sdg.number}: ${sdg.name}`}
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-md shadow-lg shadow-black/40"
            />
            <p className="mt-2 text-center text-[11px] leading-tight text-white/60">{sdg.shortName}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
