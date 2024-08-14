/*
  Warnings:

  - You are about to drop the column `deductFromAnnualLeaves` on the `LeaveRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeaveCredits" ALTER COLUMN "daysCount" SET DEFAULT 0,
ALTER COLUMN "daysCount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "deductFromAnnualLeaves",
ADD COLUMN     "totalDays" DOUBLE PRECISION DEFAULT 0;
