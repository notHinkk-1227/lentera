// Otorisasi per peran di sisi server (FR-AUTH-03).
//
// Panggil requireRole() di SETIAP halaman dashboard, Server Action, dan route handler
// yang dibatasi peran. Jangan hanya mengandalkan layout: layout tidak dirender ulang
// saat navigasi, dan Server Action bisa dipanggil langsung tanpa melewati layout.
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

// Halaman utama tiap peran. Dipakai untuk mengarahkan pengguna yang salah area.
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  DOSEN: "/dosen",
};

// Pastikan pengguna sudah login dan berperan `role`.
// - Belum login          -> /login
// - Login, peran berbeda -> beranda perannya sendiri (mis. dosen buka /admin -> /dosen)
export async function requireRole(role: Role) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== role) {
    redirect(ROLE_HOME[session.user.role]);
  }

  return session.user;
}
