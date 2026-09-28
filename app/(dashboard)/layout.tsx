import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Belum login sama sekali -> tendang ke halaman login.
  // (Pengecekan role ADMIN vs DOSEN per-route bisa ditambah belakangan;
  // untuk sekarang minimal setiap halaman dashboard wajib login dulu.)
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <DashboardSidebar />
      <div className="flex-1 px-10 py-8">{children}</div>
    </div>
  );
}