-- AlterTable
ALTER TABLE "Reimbursement" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReimbursementReceipt" ADD COLUMN     "mimeType" VARCHAR(255);

-- AlterTable
ALTER TABLE "RequestAttachment" ADD COLUMN     "mimeType" VARCHAR(255);
