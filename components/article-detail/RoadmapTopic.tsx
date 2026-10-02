import type { DetailRoadmapTopic } from "@/lib/dummy-article-detail";
import { SectionHeading } from "@/components/article-detail/SectionHeading";

// Topik roadmap Renstra 2024–2028. Dipilih manual oleh pengunggah (FR-NASKAH-04), jadi
// tidak ada skor/indikator kemiripan seperti klasifikasi topik otomatis.
export function RoadmapTopic({ topic }: { topic?: DetailRoadmapTopic }) {
  if (!topic) return null;

  return (
    <section>
      <SectionHeading>Topik roadmap</SectionHeading>
      <div className="mt-5 flex items-start gap-4">
        <span className="shrink-0 rounded-md bg-[#E5493A]/15 px-2.5 py-1 text-sm font-semibold tabular-nums text-[#FF8A7D]">
          {topic.year}-{topic.code}
        </span>
        <div className="min-w-0">
          <p className="text-base font-medium leading-snug text-white">{topic.title}</p>
          <p className="mt-1 text-sm text-white/50">{topic.context.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}
