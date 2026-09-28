"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, UserCircle2 } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", active: true },
  { label: "Kategori", active: false },
  { label: "Tentang", active: false },
];

// Sama dengan warna latar halaman di app/homepage-netflix/page.tsx (bg-[#141414]).
// Ini warna navbar begitu discroll — posisi awal (belum discroll) navbar
// transparan supaya hero terlihat utuh di baliknya.
const PAGE_BG = "#141414";

const SCROLL_THRESHOLD = 24;

export function NetflixHeader() {
  // false = posisi awal (belum discroll) -> transparan, hero terlihat penuh di baliknya.
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }

    // Cek posisi begitu mount (mis. user reload halaman dalam keadaan sudah discroll).
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-6 py-4 transition-colors duration-300 sm:px-10"
      style={{
        backgroundColor: isScrolled ? PAGE_BG : "transparent",
        boxShadow: isScrolled ? "0 1px 0 rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="flex items-center gap-8">
        <Link href="/homepage-netflix" className="flex items-center gap-2.5">
          <Image
            src="/images/brand/lentera-icon.png"
            alt=""
            width={32}
            height={30}
            className="h-8 w-auto"
          />
          <Image
            src="/images/brand/lentera-wordmark-biro-p2m.png"
            alt="Biro P2M"
            width={814}
            height={113}
            className="h-4 w-auto opacity-90"
          />
          <span aria-hidden className="h-6 w-px bg-white/20" />
          <span className="text-lg font-medium text-white">
            LENTERA<span className="text-[#E5493A]">.</span>
          </span>
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
