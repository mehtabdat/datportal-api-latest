-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BiometricsChecks" ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "totalDays" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "BiometricsChecks" ADD CONSTRAINT "BiometricsChecks_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
