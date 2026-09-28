// Seed taksonomi roadmap. Aman dijalankan berulang (upsert).
//   npx tsx prisma/seed-roadmap.ts
//
// Catatan: kalau project-mu memakai Prisma client dengan output custom / driver
// adapter, ganti dua baris import+instansiasi di bawah dengan instance dari lib/db.ts.
import { PrismaClient } from "@prisma/client";
import { themes, streams, pkmFocusAreas, years, researchTopics, pkmTopics } from "./roadmap";

const prisma = new PrismaClient();

async function main() {
  // 1. Tema penelitian unggulan
  for (const t of themes) {
    await prisma.researchTheme.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
  }

  // 2. Spesialisasi + relasi ke tema (bidang fokus)
  const streamId: Record<string, string> = {};
  for (const s of streams) {
    const themeRefs = s.themes.map((slug) => ({ slug }));
    const row = await prisma.researchStream.upsert({
      where: { slug: s.slug },
      update: { name: s.name, themes: { set: themeRefs } },
      create: { slug: s.slug, name: s.name, themes: { connect: themeRefs } },
    });
    streamId[s.slug] = row.id;
  }

  // 3. Bidang fokus PkM
  for (const f of pkmFocusAreas) {
    await prisma.pkmFocusArea.upsert({
      where: { slug: f.slug },
      update: { name: f.name },
      create: f,
    });
  }

  // 4. Tahun + Topik Besar PkM (harus ada sebelum topik, karena FK)
  for (const y of years) {
    await prisma.roadmapYear.upsert({
      where: { year: y.year },
      update: { pkmTheme: y.pkmTheme },
      create: y,
    });
  }

  // 5. Topik roadmap penelitian
  for (const [streamSlug, topics] of Object.entries(researchTopics)) {
    for (const [year, code, title] of topics) {
      const slug = `research-${streamSlug}-${year}-${code.toLowerCase()}`;
      await prisma.roadmapTopic.upsert({
        where: { slug },
        update: { title },
        create: { slug, type: "RESEARCH", year, code, title, streamId: streamId[streamSlug] },
      });
    }
  }

  // 6. Topik roadmap PkM
  for (const [year, code, title] of pkmTopics) {
    const slug = `pkm-${year}-${code.toLowerCase()}`;
    await prisma.roadmapTopic.upsert({
      where: { slug },
      update: { title },
      create: { slug, type: "PKM", year, code, title },
    });
  }

  const [nTopics, nThemes] = await Promise.all([
    prisma.roadmapTopic.count(),
    prisma.researchTheme.count(),
  ]);
  console.log(`Seed selesai: ${nTopics} topik roadmap (harusnya 72), ${nThemes} tema.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
