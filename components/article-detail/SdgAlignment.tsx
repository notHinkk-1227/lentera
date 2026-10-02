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
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-5">
        {items.map((sdg) => (
          <li key={sdg.number} title={`SDG ${sdg.number}: ${sdg.name}`} className="w-[88px]">
            <Image
              src={`/images/sdg/sdg-${String(sdg.number).padStart(2, "0")}.png`}
              alt={`SDG ${sdg.number}: ${sdg.name}`}
              width={88}
              height={88}
              unoptimized
              className="h-[88px] w-[88px] rounded-md"
            />
            <p className="mt-2 text-xs leading-tight text-white/60">{sdg.shortName}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
