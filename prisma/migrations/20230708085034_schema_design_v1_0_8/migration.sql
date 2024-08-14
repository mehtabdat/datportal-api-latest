/*
  Warnings:

  - You are about to drop the column `task` on the `DailyRoutine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyRoutine" DROP COLUMN "task",
ADD COLUMN     "taskTypeId" INTEGER,
ALTER COLUMN "noOfHours" SET DEFAULT 0,
ALTER COLUMN "noOfHours" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "ProjectComponent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
