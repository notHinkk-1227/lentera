// Augmentasi tipe NextAuth: secara default `session.user` cuma punya
// name/email/image. Kita tambahkan id & role supaya bisa dipakai langsung
// sebagai authorId di route handler tanpa error TypeScript.
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
