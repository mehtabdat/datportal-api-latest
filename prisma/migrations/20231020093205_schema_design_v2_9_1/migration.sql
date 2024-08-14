/*
  Warnings:

  - You are about to drop the column `xeroReference` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,rate,xeroTenantId]` on the table `TaxRate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_xeroReference_key";

-- DropIndex
DROP INDEX "TaxRate_title_rate_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "xeroReference";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "bankAccountHolderName" VARCHAR(255),
ADD COLUMN     "bankAccountNumber" VARCHAR(255),
ADD COLUMN     "bankIBAN" VARCHAR(255),
ADD COLUMN     "bankName" VARCHAR(255),
ADD COLUMN     "bankSwiftCode" VARCHAR(255),
ADD COLUMN     "organizationCode" VARCHAR(20);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "TaxRate" ADD COLUMN     "xeroTenantId" VARCHAR(255);

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "recordType" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ClientXeroConnection" (
    "clientId" INTEGER NOT NULL,
    "xeroTenantId" TEXT NOT NULL,
    "xeroReference" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientXeroConnection_xeroTenantId_clientId_xeroReference_key" ON "ClientXeroConnection"("xeroTenantId", "clientId", "xeroReference");

-- CreateIndex
CREATE UNIQUE INDEX "TaxRate_title_rate_xeroTenantId_key" ON "TaxRate"("title", "rate", "xeroTenantId");

-- AddForeignKey
ALTER TABLE "ClientXeroConnection" ADD CONSTRAINT "ClientXeroConnection_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
