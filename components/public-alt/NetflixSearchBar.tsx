"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Catatan: hasil pencarian tetap mengarah ke /search (versi terang/akademik) —
// halaman search belum punya versi gelap sendiri. Ini sudah cukup untuk
// membandingkan ARAH DESAIN homepage; kalau tema gelap ini disetujui klien,
// /search perlu dibuatkan versi gelap juga di tahap berikutnya.
export function NetflixSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/50"
        strokeWidth={1.75}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul, penulis, atau kata kunci"
        className="w-full rounded-md border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />
    </form>
  );
}
