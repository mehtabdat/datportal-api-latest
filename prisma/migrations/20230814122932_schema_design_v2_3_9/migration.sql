/*
  Warnings:

  - Made the column `addedDate` on table `BiometricsChecks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "addedById" INTEGER;

-- AlterTable
ALTER TABLE "BiometricsChecks" ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "biometricsJobId" INTEGER,
ADD COLUMN     "checkIn" TIMESTAMP(3),
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "addedDate" SET NOT NULL,
ALTER COLUMN "addedDate" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "BiometricsJob" (
    "id" SERIAL NOT NULL,
    "file" VARCHAR(255) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "addedById" INTEGER,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricsJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiometricsJob" ADD CONSTRAINT "BiometricsJob_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricsChecks" ADD CONSTRAINT "BiometricsChecks_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricsChecks" ADD CONSTRAINT "BiometricsChecks_biometricsJobId_fkey" FOREIGN KEY ("biometricsJobId") REFERENCES "BiometricsJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
