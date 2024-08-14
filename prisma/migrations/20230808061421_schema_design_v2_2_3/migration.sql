/*
  Warnings:

  - You are about to drop the column `individualClientId` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `authorities` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `components` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `individualClientId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `itemListforApproval` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `quoteNumber` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `scopeOfWork` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `QuotationMilestone` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the `CompanyCar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CarReservationRequest" DROP CONSTRAINT "CarReservationRequest_companyCarId_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_individualClientId_fkey";

-- DropForeignKey
ALTER TABLE "Leads" DROP CONSTRAINT "Leads_representativeId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_individualClientId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_userId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedById" INTEGER,
ADD COLUMN     "deletedDate" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CompanyAsset" ADD COLUMN     "branchId" INTEGER;

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "individualClientId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "authorities",
DROP COLUMN "components",
DROP COLUMN "individualClientId",
DROP COLUMN "itemListforApproval",
DROP COLUMN "quoteNumber",
DROP COLUMN "scopeOfWork",
ADD COLUMN     "comment" VARCHAR(500),
ADD COLUMN     "onHold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referenceNumber" VARCHAR(50);

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "projectId" INTEGER;

-- AlterTable
ALTER TABLE "QuotationMilestone" DROP COLUMN "amount",
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER;

-- DropTable
DROP TABLE "CompanyCar";

-- CreateTable
CREATE TABLE "ProjectClient" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "isRepresentative" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectClient_projectId_clientId_key" ON "ProjectClient"("projectId", "clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClient" ADD CONSTRAINT "ProjectClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectClient" ADD CONSTRAINT "ProjectClient_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarReservationRequest" ADD CONSTRAINT "CarReservationRequest_companyCarId_fkey" FOREIGN KEY ("companyCarId") REFERENCES "CompanyAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAsset" ADD CONSTRAINT "CompanyAsset_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
