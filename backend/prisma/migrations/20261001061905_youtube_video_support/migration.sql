/*
  Warnings:

  - A unique constraint covering the columns `[youtubeVideoId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `youtubeVideoId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "youtubeVideoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeVideoId_key" ON "Video"("youtubeVideoId");

-- CreateIndex
CREATE INDEX "Video_category_status_idx" ON "Video"("category", "status");
