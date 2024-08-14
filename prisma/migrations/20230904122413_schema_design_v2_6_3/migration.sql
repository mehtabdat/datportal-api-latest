/*
  Warnings:

  - You are about to drop the column `cartId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGatewayId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recordType` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionCode` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionData` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionMessage` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionStatus` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionUrl` on the `Transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_paymentGatewayId_fkey";

-- AlterTable
ALTER TABLE "EnquiryAttachment" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "cartId",
DROP COLUMN "invoiceId",
DROP COLUMN "paymentGatewayId",
DROP COLUMN "recordType",
DROP COLUMN "transactionCode",
DROP COLUMN "transactionData",
DROP COLUMN "transactionMessage",
DROP COLUMN "transactionStatus",
DROP COLUMN "transactionUrl",
ADD COLUMN     "auhorityId" INTEGER,
ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "modifiedDate" TIMESTAMP(3),
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "title" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_auhorityId_fkey" FOREIGN KEY ("auhorityId") REFERENCES "Authorities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
