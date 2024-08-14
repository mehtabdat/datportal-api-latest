/*
  Warnings:

  - You are about to drop the column `auhorityId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `Transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_auhorityId_fkey";

-- AlterTable
ALTER TABLE "FileManagement" ADD COLUMN     "permitId" INTEGER;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "auhorityId",
DROP COLUMN "transactionType",
ADD COLUMN     "assignedToId" INTEGER,
ADD COLUMN     "authorityId" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receipt" VARCHAR(255);

-- CreateTable
CREATE TABLE "Permit" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER,
    "projectId" INTEGER,
    "authorityId" INTEGER,
    "title" VARCHAR(255),
    "remarks" TEXT,
    "financeStatus" INTEGER NOT NULL DEFAULT 1,
    "clientStatus" INTEGER NOT NULL DEFAULT 1,
    "approvedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedById" INTEGER,
    "modifiedById" INTEGER,

    CONSTRAINT "Permit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Permit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authorities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "Authorities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
