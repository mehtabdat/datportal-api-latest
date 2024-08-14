/*
  Warnings:

  - You are about to drop the column `userIdId` on the `DailyRoutine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,userId]` on the table `ProjectMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DailyRoutine" DROP CONSTRAINT "DailyRoutine_userIdId_fkey";

-- AlterTable
ALTER TABLE "DailyRoutine" DROP COLUMN "userIdId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "ProjectMembers" ALTER COLUMN "projectRole" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "ProjectState" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_projectId_userId_key" ON "ProjectMembers"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
