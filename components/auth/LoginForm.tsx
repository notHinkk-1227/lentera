"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    // redirect: false supaya kita yang atur redirect-nya sendiri (beda tujuan
    // untuk ADMIN vs DOSEN), bukan NextAuth yang otomatis redirect.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setIsSubmitting(false);
      setError("Email atau kata sandi salah.");
      return;
    }

    // signIn() yang berhasil belum langsung mengembalikan data session (cuma
    // status ok/error), jadi kita ambil session-nya sekali lagi untuk tahu role.
    const session = await getSession();
    router.push(session?.user?.role === "ADMIN" ? "/admin" : "/dosen");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-md bg-status-rejected-soft px-3 py-2 text-sm text-status-rejected">
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@kampus.ac.id"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Kata sandi
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}