ALTER TABLE "Video"
ADD COLUMN "sourcePublishedAt" TIMESTAMP(3),
ADD COLUMN "durationSeconds" INTEGER,
ADD COLUMN "channelTitle" TEXT,
ADD COLUMN "youtubeCategoryId" TEXT;
