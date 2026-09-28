// Route handler: hanya urus parsing request & response.
// Semua business logic ada di articleService — lihat lib/services/articleService.ts
import { NextRequest, NextResponse } from "next/server";
import { articleService } from "@/lib/services/articleService";
import { auth } from "@/lib/auth";
import { z } from "zod";

// GET /api/articles?query=...&facultyId=...&categoryId=...&page=1
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const articles = await articleService.searchPublicArticles({
    query: searchParams.get("query") ?? undefined,
    facultyId: searchParams.get("facultyId") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    page: Number(searchParams.get("page") ?? "1"),
  });

  return NextResponse.json({ data: articles });
}

const submitArticleSchema = z.object({
  title: z.string().min(5),
  abstract: z.string().min(20),
  keywords: z.array(z.string()).min(1),
  year: z.number().int().min(1990),
  facultyId: z.string(),
  categoryIds: z.array(z.string()).min(1),
  fileUrl: z.string().url(),
  coverUrl: z.string().url().optional(),
});

// POST /api/articles — dosen mengunggah artikel baru
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  if (session.user.role !== "DOSEN") {
    return NextResponse.json({ error: "Hanya dosen yang boleh mengunggah artikel" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = submitArticleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const article = await articleService.submitArticle({
    ...parsed.data,
    authorId: session.user.id,
  });

  return NextResponse.json({ data: article }, { status: 201 });
}