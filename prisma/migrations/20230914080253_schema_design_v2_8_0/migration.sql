-- AlterTable
ALTER TABLE "PayrollCycle" ADD COLUMN     "failed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failedReport" JSONB,
ADD COLUMN     "processedDate" TIMESTAMP(3),
ADD COLUMN     "success" INTEGER NOT NULL DEFAULT 0;
