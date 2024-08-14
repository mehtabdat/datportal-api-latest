/*
  Warnings:

  - You are about to drop the `UserAlerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAlertsSentLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ThresholdType" AS ENUM ('monthly', 'yearly');

-- DropForeignKey
ALTER TABLE "UserAlerts" DROP CONSTRAINT "UserAlerts_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "linkLabel" VARCHAR(100);

-- DropTable
DROP TABLE "UserAlerts";

-- DropTable
DROP TABLE "UserAlertsSentLog";

-- CreateTable
CREATE TABLE "LevaeType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "threshold" INTEGER NOT NULL DEFAULT 0,
    "thresholdType" "ThresholdType" NOT NULL DEFAULT 'monthly',

    CONSTRAINT "LevaeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" SERIAL NOT NULL,
    "trialPeriod" INTEGER NOT NULL DEFAULT 0,
    "areHolidaysPaidInTrialPeriod" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);
