import { Compass } from "lucide-react";
import type { DetailRoadmapTopic } from "@/lib/dummy-article-detail";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Topik roadmap Renstra 2024–2028. Dipilih manual oleh pengunggah (FR-NASKAH-04), jadi
// tidak ada skor/indikator kemiripan seperti klasifikasi topik otomatis.
export function RoadmapTopic({ topic }: { topic?: DetailRoadmapTopic }) {
  if (!topic) return null;

  return (
    <section>
      <SectionHeading>Topik roadmap</SectionHeading>
      <div className="mt-3 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5493A]/15 text-[#E5493A]">
          <Compass className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-xs font-medium text-[#E5493A]">
            {topic.year}-{topic.code}
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug text-white">{topic.title}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topic.context.map((label) => (
              <span key={label} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
