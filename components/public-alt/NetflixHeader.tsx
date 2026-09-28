import Link from "next/link";
import { Search, UserCircle2 } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", active: true },
  { label: "Kategori", active: false },
  { label: "Tentang", active: false },
];

export function NetflixHeader() {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 sm:px-10">
      <div className="flex items-center gap-8">
        <Link href="/homepage-netflix" className="text-lg font-medium text-white">
          Repositori<span className="text-[#E5493A]">.</span>
        </Link>
        <nav className="hidden gap-6 sm:flex">
          {NAV_ITEMS.map((item) => (
            <span key={item.label} className="relative pb-1 text-sm text-white/70">
              {item.label}
              {item.active ? (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#E5493A]" />
              ) : null}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Cari"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Search className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>
        <Link
          href="/login"
          className="flex items-center gap-1.5 rounded-full border border-white/20 py-1.5 pl-1.5 pr-3 text-sm text-white transition-colors hover:bg-white/10"
        >
          <UserCircle2 className="h-5 w-5" strokeWidth={1.5} />
          Masuk
        </Link>
        <Link
          href="/dosen/unggah"
          className="rounded-md bg-[#D8432F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Unggah artikel
        </Link>
      </div>
    </header>
  );
}
