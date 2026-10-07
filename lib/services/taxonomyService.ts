// Data master fakultas & kategori (FR-ADM-01). Entri yang masih dipakai tidak boleh dihapus,
// supaya karya dan akun yang sudah ada tidak kehilangan fakultas/kategorinya.
import { Prisma } from "@prisma/client";
import { ServiceError } from "@/lib/errors";
import { categoryRepository, facultyRepository } from "@/lib/repositories/taxonomyRepository";

function rethrowIfDuplicate(error: unknown, label: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new ServiceError(`${label} dengan nama itu sudah ada.`, 409);
  }
  throw error;
}

export const taxonomyService = {
  listFaculties: () => facultyRepository.findAll(),
  listCategories: () => categoryRepository.findAll(),

  async addFaculty(name: string) {
    if (await facultyRepository.findByName(name)) {
      throw new ServiceError("Fakultas dengan nama itu sudah ada.", 409);
    }
    return facultyRepository.create(name).catch((e) => rethrowIfDuplicate(e, "Fakultas"));
  },

  async removeFaculty(id: string) {
    const usage = await facultyRepository.findUsage(id);
    if (!usage) return;
    const { users, articles } = usage._count;
    if (users > 0 || articles > 0) {
      throw new ServiceError(
        `Fakultas masih dipakai oleh ${users} akun dan ${articles} karya, jadi tidak bisa dihapus.`,
        409,
      );
    }
    await facultyRepository.delete(id);
  },

  async addCategory(name: string) {
    if (await categoryRepository.findByName(name)) {
      throw new ServiceError("Kategori dengan nama itu sudah ada.", 409);
    }
    return categoryRepository.create(name).catch((e) => rethrowIfDuplicate(e, "Kategori"));
  },

  async removeCategory(id: string) {
    const usage = await categoryRepository.findUsage(id);
    if (!usage) return;
    if (usage._count.articles > 0) {
      throw new ServiceError(
        `Kategori masih dipakai oleh ${usage._count.articles} karya, jadi tidak bisa dihapus.`,
        409,
      );
    }
    await categoryRepository.delete(id);
  },
};
