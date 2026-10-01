import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

// Layout hanya memastikan ada sesi dan memberi identitas ke sidebar.
// Pembatasan peran (ADMIN vs DOSEN) dilakukan di tiap halaman dan Server Action
// lewat requireRole() di lib/authz.ts, karena layout tidak dirender ulang saat navigasi.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <DashboardSidebar
        user={{ name: session.user.name ?? "Pengguna", role: session.user.role }}
      />
      <div className="flex-1 px-10 py-8">{children}</div>
    </div>
  );
}
