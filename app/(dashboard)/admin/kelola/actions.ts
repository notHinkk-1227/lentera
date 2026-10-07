"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authz";
import { ServiceError } from "@/lib/errors";
import { taxonomyService } from "@/lib/services/taxonomyService";
import { taxonomyNameSchema } from "@/lib/validation/article";

export type ManageResult = { error?: string };

// Setiap action memeriksa peran sendiri (FR-AUTH-03) dan mengembalikan pesan error yang
// aman ditampilkan, bukan melempar, supaya panel bisa menampilkannya di tempat.
async function run(task: () => Promise<unknown>): Promise<ManageResult> {
  await requireRole("ADMIN");
  try {
    await task();
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };
    console.error("Kelola fakultas/kategori gagal", error);
    return { error: "Terjadi kesalahan di server." };
  }
  revalidatePath("/admin/kelola");
  return {};
}

function parseName(name: string) {
  const parsed = taxonomyNameSchema.safeParse(name);
  if (!parsed.success) throw new ServiceError(parsed.error.issues[0]?.message ?? "Nama tidak valid.");
  return parsed.data;
}

export async function addFacultyAction(name: string) {
  return run(() => taxonomyService.addFaculty(parseName(name)));
}
export async function removeFacultyAction(id: string) {
  return run(() => taxonomyService.removeFaculty(id));
}
export async function addCategoryAction(name: string) {
  return run(() => taxonomyService.addCategory(parseName(name)));
}
export async function removeCategoryAction(id: string) {
  return run(() => taxonomyService.removeCategory(id));
}
