/*
  Warnings:

  - You are about to drop the column `type` on the `BiometricsChecks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "BiometricsChecks" DROP COLUMN "type",
ADD COLUMN     "mode" "BiometricsChecksType" NOT NULL DEFAULT 'in';
