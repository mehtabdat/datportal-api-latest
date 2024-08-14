/*
  Warnings:

  - You are about to drop the column `percentage` on the `QuotationMilestone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "expiryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "QuotationMilestone" DROP COLUMN "percentage",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
