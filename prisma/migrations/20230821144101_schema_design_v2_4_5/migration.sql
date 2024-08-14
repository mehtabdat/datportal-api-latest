/*
  Warnings:

  - You are about to drop the column `isOnLeave` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `leaveRequestId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `payType` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_leaveRequestId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "isOnLeave",
DROP COLUMN "leaveRequestId",
DROP COLUMN "payType";
