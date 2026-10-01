"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authz";
import { approveQueuedArticle, rejectQueuedArticle } from "@/lib/dummy-data";

// Server Action bisa dipanggil langsung dari klien, jadi peran dicek di sini
// dan tidak cukup hanya di layout/halaman (FR-AUTH-03).
//
// TODO: ganti approveQueuedArticle/rejectQueuedArticle (mutasi array dummy)
// dengan articleService.reviewArticle(id, "PUBLISHED" | "REJECTED", note)
// begitu halaman antrean membaca dari database.
export async function approveArticleAction(id: string) {
  await requireRole("ADMIN");

  approveQueuedArticle(id);
  redirect("/admin?reviewed=approved");
}

export async function rejectArticleAction(id: string, note: string) {
  await requireRole("ADMIN");

  // PRD FR-VERIF-03: catatan penolakan wajib.
  if (!note.trim()) {
    throw new Error("Catatan penolakan wajib diisi.");
  }

  rejectQueuedArticle(id);
  // TODO: kirim `note` sebagai rejectedNote ke articleService begitu backend aktif.
  redirect("/admin?reviewed=rejected");
}
