/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Quotation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[xeroReference]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `InvoiceItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `Quotation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `QuotationMilestone` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xeroReference]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `vatAmount` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "xeroReference" VARCHAR(255);

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "amount",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "xeroReference" VARCHAR(255),
ALTER COLUMN "vatAmount" SET NOT NULL,
ALTER COLUMN "vatAmount" SET DEFAULT 0,
ALTER COLUMN "total" SET NOT NULL,
ALTER COLUMN "total" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "xeroReference" VARCHAR(255);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "xeroReference" VARCHAR(255);

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "totalAmount",
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "xeroReference" VARCHAR(255);

-- AlterTable
ALTER TABLE "QuotationMilestone" ADD COLUMN     "xeroReference" VARCHAR(255);

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "invoiceId" INTEGER,
ADD COLUMN     "xeroReference" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Client_xeroReference_key" ON "Client"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_xeroReference_key" ON "Invoice"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_xeroReference_key" ON "InvoiceItem"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "Project_xeroReference_key" ON "Project"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_xeroReference_key" ON "Quotation"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "QuotationMilestone_xeroReference_key" ON "QuotationMilestone"("xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_xeroReference_key" ON "Transactions"("xeroReference");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
