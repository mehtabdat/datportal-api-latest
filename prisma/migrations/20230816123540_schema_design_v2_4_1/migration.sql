/*
  Warnings:

  - You are about to alter the column `mimeType` on the `ReimbursementReceipt` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `mimeType` on the `RequestAttachment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `mimeType` on the `UserDocument` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "BiometricsJob" ADD COLUMN     "backgroundId" VARCHAR(50),
ADD COLUMN     "failed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedRecord" JSONB,
ADD COLUMN     "failedReport" JSONB,
ADD COLUMN     "mimeType" VARCHAR(50),
ADD COLUMN     "processeStartDate" TIMESTAMP(3),
ADD COLUMN     "processedDate" TIMESTAMP(3),
ADD COLUMN     "processedFile" VARCHAR(255),
ADD COLUMN     "success" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRecords" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "uploadFormatId" INTEGER;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectHoldById" INTEGER;

-- AlterTable
ALTER TABLE "QuotationMilestone" ADD COLUMN     "requirePayment" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReimbursementReceipt" ALTER COLUMN "mimeType" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "RequestAttachment" ALTER COLUMN "mimeType" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "UserDocument" ALTER COLUMN "mimeType" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "BulkUploadFormat" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "format" JSONB NOT NULL,
    "sample" JSONB,
    "comment" VARCHAR(500),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulkUploadFormat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectHoldById_fkey" FOREIGN KEY ("projectHoldById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricsJob" ADD CONSTRAINT "BiometricsJob_uploadFormatId_fkey" FOREIGN KEY ("uploadFormatId") REFERENCES "BulkUploadFormat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
