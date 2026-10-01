import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg text-ink">
          LENTERA
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Masuk
          </Link>
          <Link
            href="/dosen/unggah"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Unggah karya
          </Link>
        </div>
      </div>
    </header>
  );
}
