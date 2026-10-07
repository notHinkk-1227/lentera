// Route handler: hanya urus parsing request & response.
// Semua business logic ada di articleService — lihat lib/services/articleService.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ServiceError } from "@/lib/errors";
import { articleService } from "@/lib/services/articleService";
import { MAX_PDF_BYTES, submitArticleFieldsSchema } from "@/lib/validation/article";

// GET /api/articles?query=...&faculty=...&facultyId=...&categoryId=...&page=1
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // `page` dari query string bisa berupa apa saja ("abc", "-3", "0"); paksa jadi bilangan bulat >= 1.
  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? pageParam : 1;

  const { items, ...meta } = await articleService.searchPublicArticles({
    query: searchParams.get("query") ?? undefined,
    facultyName: searchParams.get("faculty") ?? undefined,
    facultyId: searchParams.get("facultyId") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    page,
  });

  return NextResponse.json({ data: items, meta });
}

// POST /api/articles — dosen mengunggah karya baru (multipart/form-data):
//   title, abstract, year, keywords (boleh berulang), categoryIds (boleh berulang), pdf (berkas)
// Fakultas diambil dari profil pengunggah, bukan dari body.
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  if (session.user.role !== "DOSEN") {
    return NextResponse.json({ error: "Hanya dosen yang boleh mengunggah artikel" }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = submitArticleFieldsSchema.safeParse({
    title: form.get("title"),
    abstract: form.get("abstract"),
    year: form.get("year"),
    keywords: form.getAll("keywords").map(String),
    categoryIds: form.getAll("categoryIds").map(String),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });
  }

  const pdf = form.get("pdf");
  if (!(pdf instanceof File) || pdf.size === 0) {
    return NextResponse.json({ error: "File PDF wajib diunggah." }, { status: 400 });
  }
  if (pdf.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "Ukuran PDF melebihi 20 MB." }, { status: 413 });
  }

  try {
    const article = await articleService.submitArticle({
      ...parsed.data,
      uploaderId: session.user.id,
      pdf: Buffer.from(await pdf.arrayBuffer()),
    });
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/articles gagal", error);
    return NextResponse.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
