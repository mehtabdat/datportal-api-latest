/*
  Warnings:

  - You are about to drop the column `addedBy` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `FileManagement` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `FileManagement` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `FileManagement` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `ProjectConversation` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `RolePermissions` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `currencyCode` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `addedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `agentVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrgContact` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userCountry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProjectComments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[leadId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_modifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "FileManagement" DROP CONSTRAINT "FileManagement_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "FileManagement" DROP CONSTRAINT "FileManagement_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "FileManagement" DROP CONSTRAINT "FileManagement_modifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_modifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectComments" DROP CONSTRAINT "ProjectComments_commentedId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectComments" DROP CONSTRAINT "ProjectComments_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_modifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "RolePermissions" DROP CONSTRAINT "RolePermissions_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_modifiedBy_fkey";

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "addedBy",
DROP COLUMN "deletedBy",
DROP COLUMN "modifiedBy";

-- AlterTable
ALTER TABLE "FileManagement" DROP COLUMN "addedBy",
DROP COLUMN "deletedBy",
DROP COLUMN "modifiedBy",
ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "deletedById" INTEGER,
ADD COLUMN     "modifiedById" INTEGER;

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "individualClientId" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "projectTypeId" INTEGER,
ADD COLUMN     "representativeId" INTEGER;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "addedBy",
DROP COLUMN "deletedBy",
DROP COLUMN "modifiedBy",
ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "deletedById" INTEGER,
ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "departmentId",
ADD COLUMN     "individualClientId" INTEGER,
ADD COLUMN     "leadId" INTEGER;

-- AlterTable
ALTER TABLE "ProjectConversation" DROP COLUMN "isPrivate";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "addedBy",
DROP COLUMN "deletedBy",
DROP COLUMN "modifiedBy",
ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "deletedById" INTEGER,
ADD COLUMN     "modifiedById" INTEGER;

-- AlterTable
ALTER TABLE "RolePermissions" DROP COLUMN "addedBy",
ADD COLUMN     "addedById" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "currencyCode",
DROP COLUMN "organizationId",
ADD COLUMN     "invoiceId" INTEGER,
ADD COLUMN     "projectId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addedBy",
DROP COLUMN "agentVerified",
DROP COLUMN "deletedBy",
DROP COLUMN "displayOrgContact",
DROP COLUMN "modifiedBy",
DROP COLUMN "userCountry",
ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "deletedById" INTEGER,
ADD COLUMN     "modifiedById" INTEGER;

-- DropTable
DROP TABLE "ProjectComments";

-- CreateTable
CREATE TABLE "OrganizationDepartmentRelation" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "departmentHeadId" INTEGER,

    CONSTRAINT "OrganizationDepartmentRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER,
    "scopeOfWork" TEXT,
    "file" VARCHAR(255),
    "type" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentDate" TIMESTAMP(3),
    "modifiedDate" TIMESTAMP(3),
    "addedById" INTEGER,
    "modifiedById" INTEGER,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "message" TEXT,
    "projectId" INTEGER,
    "amount" DOUBLE PRECISION,
    "vatAmount" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "status" INTEGER NOT NULL DEFAULT 1,
    "file" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentDate" TIMESTAMP(3),
    "modifiedDate" TIMESTAMP(3),
    "addedById" INTEGER,
    "modifiedById" INTEGER,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reimbursement" (
    "id" SERIAL NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "requestById" INTEGER,
    "approvedAmount" DOUBLE PRECISION,
    "purpose" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reimbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReimbursementDocument" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255),
    "status" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reimbursementId" INTEGER,

    CONSTRAINT "ReimbursementDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReimbursementAction" (
    "id" SERIAL NOT NULL,
    "department" VARCHAR(255),
    "actionById" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reimbursementId" INTEGER,

    CONSTRAINT "ReimbursementAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" SERIAL NOT NULL,
    "requestById" INTEGER,
    "typeOfLeave" INTEGER,
    "leaveFrom" TIMESTAMP(3),
    "leaveTo" TIMESTAMP(3),
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedDate" TIMESTAMP(3),

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationDepartmentRelation_organizationId_departmentId_key" ON "OrganizationDepartmentRelation"("organizationId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_leadId_key" ON "Project"("leadId");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_individualClientId_fkey" FOREIGN KEY ("individualClientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDepartmentRelation" ADD CONSTRAINT "OrganizationDepartmentRelation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDepartmentRelation" ADD CONSTRAINT "OrganizationDepartmentRelation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationDepartmentRelation" ADD CONSTRAINT "OrganizationDepartmentRelation_departmentHeadId_fkey" FOREIGN KEY ("departmentHeadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_individualClientId_fkey" FOREIGN KEY ("individualClientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "ProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reimbursement" ADD CONSTRAINT "Reimbursement_requestById_fkey" FOREIGN KEY ("requestById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementDocument" ADD CONSTRAINT "ReimbursementDocument_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementAction" ADD CONSTRAINT "ReimbursementAction_actionById_fkey" FOREIGN KEY ("actionById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementAction" ADD CONSTRAINT "ReimbursementAction_reimbursementId_fkey" FOREIGN KEY ("reimbursementId") REFERENCES "Reimbursement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_requestById_fkey" FOREIGN KEY ("requestById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
