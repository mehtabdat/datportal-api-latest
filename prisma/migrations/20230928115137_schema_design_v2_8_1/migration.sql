-- CreateTable
CREATE TABLE "FaqsMedia" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100),
    "videoPreview" VARCHAR(255),
    "path" VARCHAR(500),
    "faqId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FaqsMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaqsMedia_uuid_key" ON "FaqsMedia"("uuid");

-- AddForeignKey
ALTER TABLE "FaqsMedia" ADD CONSTRAINT "FaqsMedia_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
