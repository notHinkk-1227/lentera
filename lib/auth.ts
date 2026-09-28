// Konfigurasi NextAuth (Auth.js). Detail provider disesuaikan lagi
// saat implementasi login (kemungkinan Credentials provider dengan email+password,
// karena user adalah dosen/admin internal kampus, bukan publik).
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
        if (!user) return null;

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
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});