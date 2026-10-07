import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginShowcasePanel } from "@/components/auth/LoginShowcasePanel";

// Panel showcase membaca karya terbit dari database, jadi tidak boleh di-prerender saat build.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="grid h-screen overflow-hidden bg-paper lg:grid-cols-2">
      <div className="flex items-center justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-serif text-lg text-ink">
            LENTERA
          </Link>
          <p className="mt-1 text-xs text-ink-soft">
            Layanan Eksplorasi Penelitian, Teknologi &amp; Pengabdian
          </p>
          <p className="mt-4 text-sm text-ink-soft">Masuk sebagai dosen atau admin</p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-xs text-ink-soft">
            Akun dosen dan admin dikelola oleh Biro P2M Universitas Widyatama.
            <br />
            Hubungi admin jika belum memiliki akses.
          </p>
        </div>
      </div>

      <LoginShowcasePanel />
    </div>
  );
}
