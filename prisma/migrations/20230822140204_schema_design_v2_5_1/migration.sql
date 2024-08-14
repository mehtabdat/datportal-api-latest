/*
  Warnings:

  - A unique constraint covering the columns `[userId,checkIn]` on the table `BiometricsChecks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BiometricsChecks" ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BiometricsChecks_userId_checkIn_key" ON "BiometricsChecks"("userId", "checkIn");
