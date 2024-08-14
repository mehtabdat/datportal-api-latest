/*
  Warnings:

  - You are about to drop the column `seoDescription` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('public', 'organization', 'self');

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 4;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "managerId" INTEGER;

-- CreateTable
CREATE TABLE "Authorities" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Authorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "departmentId" INTEGER,
    "submissionById" INTEGER,
    "clientId" INTEGER,
    "projectTypeId" INTEGER,
    "quoteNumber" VARCHAR(255),
    "itemListforApproval" TEXT,
    "instructions" TEXT,
    "scopeOfWork" TEXT,
    "projectFilesLink" TEXT,
    "components" INTEGER[],
    "authorities" INTEGER[],
    "priority" INTEGER NOT NULL DEFAULT 3,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isExtended" BOOLEAN NOT NULL DEFAULT false,
    "reasonOfExtension" VARCHAR(255),
    "projectStateId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "addedById" INTEGER,
    "modifiedById" INTEGER,
    "deletedById" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectState" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "shouldCloseProject" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 9,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectState_pkey" PRIMARY KEY ("id")
);

-- CreateEnableTable
CREATE TABLE "ProjectEnableStates" (
    "id" SERIAL NOT NULL,
    "pId" INTEGER,
    "pstateId" INTEGER NOT NULL,

    CONSTRAINT "ProjectEnableStates_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProjectEnableStates_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "ProjectEnableStates_pstateId_fkey" FOREIGN KEY ("pstateId") REFERENCES "ProjectState"("id") ON DELETE CASCADE,
    CONSTRAINT "ProjectEnableStates_unique_pId_pstateId" UNIQUE ("pId", "pstateId")

);



-- CreateTable
CREATE TABLE "ProjectIncharges" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "projectRole" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProjectIncharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMembers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "projectRole" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ProjectMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileManagement" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "documentType" VARCHAR(255),
    "title" VARCHAR(255),
    "file" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100),
    "name" VARCHAR(255),
    "path" VARCHAR(500),
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 99,
    "comments" VARCHAR(500),
    "visibility" "FileVisibility" NOT NULL DEFAULT 'organization',
    "projectId" INTEGER,
    "taskId" INTEGER,
    "isTemp" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isProcessing" BOOLEAN NOT NULL DEFAULT false,
    "backgroundId" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "deletedDate" TIMESTAMP(3),
    "addedBy" INTEGER,
    "modifiedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "FileManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectComments" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "comment" TEXT,
    "commentedId" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectConversation" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "message" TEXT,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),

    CONSTRAINT "ProjectConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "projectId" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "instructions" TEXT,
    "taskStartFrom" TIMESTAMP(3),
    "taskEndOn" TIMESTAMP(3),
    "hasExtendedDate" BOOLEAN NOT NULL DEFAULT false,
    "extendedDate" TIMESTAMP(3),
    "reasonOfExtension" TEXT,
    "addedById" INTEGER,
    "closedById" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskMembers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "TaskMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRoutine" (
    "id" SERIAL NOT NULL,
    "task" VARCHAR(255),
    "remarks" TEXT,
    "noOfHours" INTEGER NOT NULL DEFAULT 0,
    "projectId" INTEGER,
    "userIdId" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3),

    CONSTRAINT "DailyRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authorities_slug_key" ON "Authorities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectType_slug_key" ON "ProjectType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectState_slug_key" ON "ProjectState"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FileManagement_uuid_key" ON "FileManagement"("uuid");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_submissionById_fkey" FOREIGN KEY ("submissionById") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "ProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectStateId_fkey" FOREIGN KEY ("projectStateId") REFERENCES "ProjectState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIncharges" ADD CONSTRAINT "ProjectIncharges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIncharges" ADD CONSTRAINT "ProjectIncharges_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComments" ADD CONSTRAINT "ProjectComments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectComments" ADD CONSTRAINT "ProjectComments_commentedId_fkey" FOREIGN KEY ("commentedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectConversation" ADD CONSTRAINT "ProjectConversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectConversation" ADD CONSTRAINT "ProjectConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskMembers" ADD CONSTRAINT "TaskMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskMembers" ADD CONSTRAINT "TaskMembers_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_userIdId_fkey" FOREIGN KEY ("userIdId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
