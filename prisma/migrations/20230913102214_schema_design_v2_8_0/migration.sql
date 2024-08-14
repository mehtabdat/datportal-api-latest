/*
  Warnings:

  - You are about to drop the column `absences` on the `Payroll` table. All the data in the column will be lost.
  - You are about to drop the column `daysWorked` on the `Payroll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "proRatedDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "staus" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "LeadEnquiryFollowUp" ADD COLUMN     "isConcern" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isResolved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "absences",
DROP COLUMN "daysWorked",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manualCorrection" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "modifiedById" INTEGER,
ADD COLUMN     "modifiedDate" TIMESTAMP(3),
ADD COLUMN     "note" VARCHAR(255),
ADD COLUMN     "otherAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidDate" TIMESTAMP(3),
ADD COLUMN     "payrollCycleId" INTEGER,
ADD COLUMN     "salaryAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "salaryId" INTEGER,
ADD COLUMN     "toBeDeductedFromCurrentSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAbsences" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalDaysWorked" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalDeduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalIncompletes" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalReceivable" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWorkingDays" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "monthYear" DROP NOT NULL,
ALTER COLUMN "toBeDeductedFromLeaveCredits" SET DEFAULT 0,
ALTER COLUMN "toBeDeductedFromLeaveCredits" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "LeaveCredits" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "daysCount" INTEGER NOT NULL DEFAULT 0,
    "note" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "entryType" INTEGER NOT NULL DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveCredits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashAdvanceInstallment" (
    "id" SERIAL NOT NULL,
    "cashAdvanceRequestId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "monthYear" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),

    CONSTRAINT "CashAdvanceInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollCycle" (
    "id" SERIAL NOT NULL,
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PayrollCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollDeduction" (
    "id" SERIAL NOT NULL,
    "payrollId" INTEGER,
    "installmentId" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PayrollDeduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayrollDeduction_installmentId_key" ON "PayrollDeduction"("installmentId");

-- AddForeignKey
ALTER TABLE "LeaveCredits" ADD CONSTRAINT "LeaveCredits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashAdvanceInstallment" ADD CONSTRAINT "CashAdvanceInstallment_cashAdvanceRequestId_fkey" FOREIGN KEY ("cashAdvanceRequestId") REFERENCES "CashAdvanceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_payrollCycleId_fkey" FOREIGN KEY ("payrollCycleId") REFERENCES "PayrollCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_modifiedById_fkey" FOREIGN KEY ("modifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollDeduction" ADD CONSTRAINT "PayrollDeduction_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollDeduction" ADD CONSTRAINT "PayrollDeduction_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "CashAdvanceInstallment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
