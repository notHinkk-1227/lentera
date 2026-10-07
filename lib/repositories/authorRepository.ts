import { db } from "@/lib/db";

export const authorRepository = {
  // Profil penulis milik sebuah akun. Dibuat otomatis saat pertama kali akun mengunggah
  // (akun yang dibuat setelah migrasi belum punya profil), memakai nama dan fakultas akun.
  async ensureForUser(userId: string) {
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, faculty: { select: { name: true } } },
    });
    return db.author.upsert({
      where: { userId },
      update: {},
      create: {
        name: user.name,
        type: "DOSEN",
        affiliation: user.faculty?.name ?? null,
        userId,
      },
      select: { id: true },
    });
  },
};
