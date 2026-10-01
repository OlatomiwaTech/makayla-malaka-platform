/*
  Warnings:

  - Added the required column `type` to the `MusicRelease` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM');

-- AlterTable
ALTER TABLE "MusicRelease" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "ReleaseType" NOT NULL;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "previewUrl" TEXT;

-- CreateIndex
CREATE INDEX "MusicPlatformLink_releaseId_idx" ON "MusicPlatformLink"("releaseId");

-- CreateIndex
CREATE INDEX "MusicRelease_isFeatured_status_idx" ON "MusicRelease"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "Track_releaseId_idx" ON "Track"("releaseId");
