// Konfigurasi NextAuth (Auth.js): Credentials (email + kata sandi), session JWT berisi id dan role.
// Tidak ada pendaftaran mandiri; akun dibuat admin (FR-AUTH-02).
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        // Akun nonaktif tidak boleh login (pesan sengaja sama dengan salah kata sandi).
        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Dipanggil setiap request untuk membaca/menulis isi JWT.
    // `user` hanya terisi sekali, tepat setelah authorize() berhasil.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Dipanggil setiap kali `auth()` atau `useSession()` dipanggil di kode kita.
    // Di sinilah id & role dari token disalin ke session.user yang dipakai di mana-mana.
    session({ session, token }) {
      // Di NextAuth v5, augmentasi tipe "next-auth/jwt" tidak mengubah tipe `token` di sini
      // (tipenya jatuh ke `unknown`), jadi nilainya di-cast eksplisit.
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
});