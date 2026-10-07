// GET /api/articles/[id]/download — satu-satunya pintu menuju berkas PDF.
// - Karya PUBLISHED: terbuka untuk publik, dan setiap unduhan menambah downloadCount (FR-PUB-05).
// - Karya lain: hanya admin atau pengunggahnya (untuk tinjauan); selain itu 404 (NFR-SEC-04).
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { articleService } from "@/lib/services/articleService";
import { storage } from "@/lib/storage";

function toFileName(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${slug || "karya"}.pdf`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  const viewer = session?.user ? { id: session.user.id, role: session.user.role } : null;

  const download = await articleService.getDownload(id, viewer);
  if (!download) {
    return NextResponse.json({ error: "Karya tidak ditemukan" }, { status: 404 });
  }

  let file;
  try {
    file = await storage.open(download.fileUrl);
  } catch (error) {
    console.error(`Berkas karya ${id} tidak dapat dibuka`, error);
    return NextResponse.json({ error: "Berkas tidak tersedia" }, { status: 404 });
  }

  // Hitung unduhan hanya setelah berkas benar-benar tersedia.
  if (download.countable) await articleService.registerDownload(id);

  if (file.kind === "redirect") {
    return NextResponse.redirect(file.url, 302);
  }

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.data.length),
      "Content-Disposition": `attachment; filename="${toFileName(download.title)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
