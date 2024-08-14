/*
  Warnings:

  - A unique constraint covering the columns `[title,taxType,xeroTenantId]` on the table `TaxRate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TaxRate_title_taxType_key";

-- CreateIndex
CREATE UNIQUE INDEX "TaxRate_title_taxType_xeroTenantId_key" ON "TaxRate"("title", "taxType", "xeroTenantId");
