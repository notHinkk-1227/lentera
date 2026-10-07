import type { ArticleStatus } from "@/lib/types";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; textClass: string; bgClass: string }> = {
  PUBLISHED: {
    label: "Dipublikasikan",
    textClass: "text-status-published",
    bgClass: "bg-status-published-soft",
  },
  PENDING: {
    label: "Menunggu verifikasi",
    textClass: "text-status-pending",
    bgClass: "bg-status-pending-soft",
  },
  REJECTED: {
    label: "Perlu revisi",
    textClass: "text-status-rejected",
    bgClass: "bg-status-rejected-soft",
  },
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgClass} ${config.textClass}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
