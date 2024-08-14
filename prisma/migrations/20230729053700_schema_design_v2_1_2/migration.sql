/*
  Warnings:

  - You are about to drop the column `email` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `hasReplied` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `phoneCode` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `timeDifference` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `userIP` on the `Leads` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Reimbursement` table. All the data in the column will be lost.
  - You are about to alter the column `purpose` on the `Reimbursement` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `ReimbursementAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReimbursementDocument` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[enquiryId]` on the table `Leads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BiometricsChecksType" AS ENUM ('in', 'out');

-- DropForeignKey
ALTER TABLE "ReimbursementAction" DROP CONSTRAINT "ReimbursementAction_actionById_fkey";

-- DropForeignKey
ALTER TABLE "ReimbursementAction" DROP CONSTRAINT "ReimbursementAction_reimbursementId_fkey";

-- DropForeignKey
ALTER TABLE "ReimbursementDocument" DROP CONSTRAINT "ReimbursementDocument_reimbursementId_fkey";

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "email",
DROP COLUMN "hasReplied",
DROP COLUMN "isDeleted",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "phoneCode",
DROP COLUMN "reference",
DROP COLUMN "slug",
DROP COLUMN "source",
DROP COLUMN "timeDifference",
DROP COLUMN "userAgent",
DROP COLUMN "userIP",
ADD COLUMN     "enquiryId" INTEGER;

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "purpose" TEXT;

-- AlterTable
ALTER TABLE "Reimbursement" DROP COLUMN "totalAmount",
ADD COLUMN     "claimedAmount" DOUBLE PRECISION,
ALTER COLUMN "purpose" DROP NOT NULL,
ALTER COLUMN "purpose" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "designation" VARCHAR(255);

-- DropTable
DROP TABLE "ReimbursementAction";

-- DropTable
DROP TABLE "ReimbursementDocument";

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(100),
    "phoneCode" VARCHAR(10),
    "message" VARCHAR(500),
    "source" VARCHAR(100),
    "userAgent" VARCHAR(255),
    "userIP" VARCHAR(50),
    "reference" VARCHAR(100),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasReplied" BOOLEAN NOT NULL DEFAULT false,
    "timeDifference" INTEGER DEFAULT 43200,
    "repliedDate" TIMESTAMP(3),
    "modifiedDate" TIMESTAMP(3),
    "addedById" INTEGER,
    "modifiedById" INTEGER,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadEnquiryFollowUp" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedById" INTEGER NOT NULL,
    "enquiryId" INTEGER,
    "leadId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeadEnquiryFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReimbursementReceipt" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255),
    "claimedAmount" DOUBLE PRECISION DEFAULT 0,
    "approvedAmount" DOUBLE PRECISION DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "comment" VARCHAR(500),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reimbursementId" INTEGER,

    CONSTRAINT "ReimbursementReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashAdvanceRequest" (
    "id" SERIAL NOT NULL,
    "requestById" INTEGER,
    "requestAmount" DOUBLE PRECISION,
    "purpose" TEXT,
    "approvedAmount" DOUBLE PRECISION,
    "numberOfInstallments" INTEGER NOT NULL DEFAULT 0,
    "installmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedDate" TIMESTAMP(3),

    CONSTRAINT "CashAdvanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCar" (
    "id" SERIAL NOT NULL,
    "make" VARCHAR(255),
    "model" VARCHAR(255),
    "plateNumber" VARCHAR(255),
    "note" VARCHAR(500),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarReservationRequest" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "requestById" INTEGER,
    "projectId" INTEGER,
    "companyCarId" INTEGER,
    "prupose" VARCHAR(500),
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarReservationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAllocation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "assetName" VARCHAR(255),
    "assetDetail" VARCHAR(255),
    "quantity" INTEGER DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAttachment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaveRequestId" INTEGER,
    "carReservationRequestId" INTEGER,
    "cashAdvanceRequestId" INTEGER,

    CONSTRAINT "RequestAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER,
    "actionById" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "comment" VARCHAR(500),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reimbursementId" INTEGER,
    "leaveRequestId" INTEGER,
    "carReservationRequestId" INTEGER,
    "cashAdvanceRequestId" INTEGER,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiometricsChecks" (
    "id" SERIAL NOT NULL,
    "type" "BiometricsChecksType" NOT NULL DEFAULT 'in',
    "addedDate" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "BiometricsChecks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "totalHours" DOUBLE PRECISION,
    "note" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_uuid_key" ON "Enquiry"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Leads_enquiryId_key" ON "Leads"("enquiryId");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadEnquiryFollowUp" ADD CONSTRAINT "LeadEnquiryFollowUp_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadEnquiryFollowUp" ADD CONSTRAINT "LeadEnquiryFollowUp_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadEnquiryFollowUp" ADD CONSTRAINT "LeadEnquiryFollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementReceipt" ADD CONSTRAINT "ReimbursementReceipt_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashAdvanceRequest" ADD CONSTRAINT "CashAdvanceRequest_requestById_fkey" FOREIGN KEY ("requestById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarReservationRequest" ADD CONSTRAINT "CarReservationRequest_requestById_fkey" FOREIGN KEY ("requestById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarReservationRequest" ADD CONSTRAINT "CarReservationRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarReservationRequest" ADD CONSTRAINT "CarReservationRequest_companyCarId_fkey" FOREIGN KEY ("companyCarId") REFERENCES "CompanyCar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAttachment" ADD CONSTRAINT "RequestAttachment_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAttachment" ADD CONSTRAINT "RequestAttachment_carReservationRequestId_fkey" FOREIGN KEY ("carReservationRequestId") REFERENCES "CarReservationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAttachment" ADD CONSTRAINT "RequestAttachment_cashAdvanceRequestId_fkey" FOREIGN KEY ("cashAdvanceRequestId") REFERENCES "CashAdvanceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_actionById_fkey" FOREIGN KEY ("actionById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_carReservationRequestId_fkey" FOREIGN KEY ("carReservationRequestId") REFERENCES "CarReservationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_cashAdvanceRequestId_fkey" FOREIGN KEY ("cashAdvanceRequestId") REFERENCES "CashAdvanceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricsChecks" ADD CONSTRAINT "BiometricsChecks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
