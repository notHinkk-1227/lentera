-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('RESEARCH', 'PKM');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('LOKAL', 'REGIONAL', 'NASIONAL', 'INTERNASIONAL');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "partner" TEXT,
ADD COLUMN     "region" "Region",
ADD COLUMN     "roadmapTopicId" TEXT,
ADD COLUMN     "sourceResearchId" TEXT,
ADD COLUMN     "type" "WorkType" NOT NULL DEFAULT 'RESEARCH';

-- CreateTable
CREATE TABLE "ResearchStream" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResearchStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchTheme" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResearchTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PkmFocusArea" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PkmFocusArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapYear" (
    "year" INTEGER NOT NULL,
    "pkmTheme" TEXT NOT NULL,

    CONSTRAINT "RoadmapYear_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "RoadmapTopic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "WorkType" NOT NULL,
    "year" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "streamId" TEXT,

    CONSTRAINT "RoadmapTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToResearchTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToResearchTheme_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleToPkmFocusArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToPkmFocusArea_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ResearchStreamToResearchTheme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResearchStreamToResearchTheme_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchStream_slug_key" ON "ResearchStream"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchStream_name_key" ON "ResearchStream"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchTheme_slug_key" ON "ResearchTheme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchTheme_name_key" ON "ResearchTheme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PkmFocusArea_slug_key" ON "PkmFocusArea"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PkmFocusArea_name_key" ON "PkmFocusArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapTopic_slug_key" ON "RoadmapTopic"("slug");

-- CreateIndex
CREATE INDEX "RoadmapTopic_type_year_idx" ON "RoadmapTopic"("type", "year");

-- CreateIndex
CREATE INDEX "_ArticleToResearchTheme_B_index" ON "_ArticleToResearchTheme"("B");

-- CreateIndex
CREATE INDEX "_ArticleToPkmFocusArea_B_index" ON "_ArticleToPkmFocusArea"("B");

-- CreateIndex
CREATE INDEX "_ResearchStreamToResearchTheme_B_index" ON "_ResearchStreamToResearchTheme"("B");

-- CreateIndex
CREATE INDEX "articles_type_status_idx" ON "articles"("type", "status");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_roadmapTopicId_fkey" FOREIGN KEY ("roadmapTopicId") REFERENCES "RoadmapTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_sourceResearchId_fkey" FOREIGN KEY ("sourceResearchId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTopic" ADD CONSTRAINT "RoadmapTopic_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ResearchStream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTopic" ADD CONSTRAINT "RoadmapTopic_year_fkey" FOREIGN KEY ("year") REFERENCES "RoadmapYear"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToResearchTheme" ADD CONSTRAINT "_ArticleToResearchTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToResearchTheme" ADD CONSTRAINT "_ArticleToResearchTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchTheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToPkmFocusArea" ADD CONSTRAINT "_ArticleToPkmFocusArea_A_fkey" FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToPkmFocusArea" ADD CONSTRAINT "_ArticleToPkmFocusArea_B_fkey" FOREIGN KEY ("B") REFERENCES "PkmFocusArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearchStreamToResearchTheme" ADD CONSTRAINT "_ResearchStreamToResearchTheme_A_fkey" FOREIGN KEY ("A") REFERENCES "ResearchStream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearchStreamToResearchTheme" ADD CONSTRAINT "_ResearchStreamToResearchTheme_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchTheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
