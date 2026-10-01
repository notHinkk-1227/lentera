"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

const DOSEN_NAV_ITEMS = [
  { href: "/dosen", label: "Ringkasan" },
  { href: "/dosen/artikel", label: "Karya saya" },
  { href: "/dosen/unggah", label: "Unggah karya" },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Antrean verifikasi" },
  { href: "/admin/kelola", label: "Fakultas & kategori" },
];

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  DOSEN: "Dosen",
};

// Menu dan identitas ditentukan oleh peran pada sesi login, bukan oleh URL.
// Client component karena butuh usePathname untuk menandai menu aktif.
export function DashboardSidebar({ user }: { user: { name: string; role: Role } }) {
  const pathname = usePathname();
  const navItems = user.role === "ADMIN" ? ADMIN_NAV_ITEMS : DOSEN_NAV_ITEMS;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface px-5 py-6">
      <div className="mb-8">
        <Link href="/" className="font-serif text-xl leading-tight text-ink">
          LENTERA
        </Link>
        <p className="mt-1 text-xs text-ink-soft">Universitas Widyatama</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-paper text-ink" : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <p className="text-sm font-medium text-ink">{user.name}</p>
        <p className="text-xs text-ink-soft">{ROLE_LABEL[user.role]}</p>
      </div>
    </aside>
  );
}
