// GET /api/articles/[id]/download — pintu menuju tautan unduh di situs eksternal.
// LENTERA tidak menyimpan PDF; route ini hanya menghitung klik lalu mengarahkan (302).
// - Karya PUBLISHED: terbuka untuk publik, dan setiap klik menambah downloadCount (FR-PUB-05).
// - Karya lain: hanya admin atau pengunggahnya (untuk tinjauan); selain itu 404 (NFR-SEC-04).
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { articleService } from "@/lib/services/articleService";
import { isHttpUrl } from "@/lib/validation/article";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  const viewer = session?.user ? { id: session.user.id, role: session.user.role } : null;

  const download = await articleService.getDownload(id, viewer);
  if (!download) {
    return NextResponse.json({ error: "Tautan unduh tidak tersedia" }, { status: 404 });
  }

  // Lapisan pertahanan kedua: jangan pernah mengarahkan ke skema selain http(s).
  if (!isHttpUrl(download.downloadUrl)) {
    console.error(`Tautan unduh karya ${id} tidak valid`);
    return NextResponse.json({ error: "Tautan unduh tidak tersedia" }, { status: 404 });
  }

  if (download.countable) await articleService.registerDownload(id);

  return NextResponse.redirect(download.downloadUrl, 302);
}
