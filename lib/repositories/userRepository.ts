import { db } from "@/lib/db";

export const userRepository = {
  // Dipakai requireRole: sesi JWT tetap berlaku sampai kedaluwarsa, jadi status aktif harus
  // dicek ulang ke database agar akun yang dinonaktifkan langsung kehilangan akses.
  async isActive(userId: string): Promise<boolean> {
    const user = await db.user.findUnique({ where: { id: userId }, select: { isActive: true } });
    return user?.isActive === true;
  },

  // Fakultas pengunggah — dipakai sebagai fakultas karya (FR-NASKAH-01).
  findFaculty(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
      select: { facultyId: true, faculty: { select: { name: true } } },
    });
  },
};
