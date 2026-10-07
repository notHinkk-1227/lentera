import { Inbox } from "lucide-react";
import { VerificationQueueItem } from "@/components/dashboard/VerificationQueueItem";
import type { QueuedArticle } from "@/lib/types";

export function VerificationQueueList({ articles }: { articles: QueuedArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <Inbox className="h-8 w-8 text-ink-soft" strokeWidth={1.5} />
        <p className="mt-3 font-serif text-lg text-ink">Antrean kosong</p>
        <p className="mt-1 text-sm text-ink-soft">Semua artikel sudah diverifikasi.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <VerificationQueueItem key={article.id} article={article} />
      ))}
    </div>
  );
}
