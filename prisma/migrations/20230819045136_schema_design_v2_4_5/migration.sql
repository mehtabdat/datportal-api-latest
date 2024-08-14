-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "isOnLeave" BOOLEAN DEFAULT false,
ADD COLUMN     "leaveRequestId" INTEGER,
ADD COLUMN     "payType" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "LeaveRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
