"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authz";
import { ServiceError } from "@/lib/errors";
import { articleService } from "@/lib/services/articleService";
import { rejectNoteSchema } from "@/lib/validation/article";

// Server Action bisa dipanggil langsung dari klien, jadi peran dicek di sini
// dan tidak cukup hanya di layout/halaman (FR-AUTH-03).
//
// reviewArticle hanya mengubah karya yang masih PENDING. Bila karya sudah ditinjau
// (mis. admin lain menekan tombol lebih dulu), kita kembali ke antrean tanpa menimpa apa pun.
export async function approveArticleAction(id: string) {
  await requireRole("ADMIN");

  const changed = await articleService.reviewArticle(id, "PUBLISHED");
  redirect(changed ? "/admin?reviewed=approved" : "/admin");
}

export async function rejectArticleAction(id: string, note: string) {
  await requireRole("ADMIN");

  // PRD FR-VERIF-03: catatan penolakan wajib.
  const parsed = rejectNoteSchema.safeParse(note);
  if (!parsed.success) {
    throw new ServiceError(parsed.error.issues[0]?.message ?? "Catatan penolakan wajib diisi.");
  }

  const changed = await articleService.reviewArticle(id, "REJECTED", parsed.data);
  redirect(changed ? "/admin?reviewed=rejected" : "/admin");
}
