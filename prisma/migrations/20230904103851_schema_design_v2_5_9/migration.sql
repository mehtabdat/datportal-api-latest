/*
  Warnings:

  - You are about to drop the column `typeOfLeave` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the `LevaeType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemSetting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `leaveTypeId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "typeOfLeave",
ADD COLUMN     "deductFromAnnualLeaves" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leaveTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "revisedQuotationReferenceId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfJoining" TIMESTAMP(3),
ADD COLUMN     "lastWorkingDate" TIMESTAMP(3),
ADD COLUMN     "remainingAnnualLeaves" INTEGER NOT NULL DEFAULT 30;

-- DropTable
DROP TABLE "LevaeType";

-- DropTable
DROP TABLE "SystemSetting";

-- CreateTable
CREATE TABLE "EnquiryAttachment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "file" VARCHAR(255),
    "mimeType" VARCHAR(50),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enquiryId" INTEGER,
    "leadId" INTEGER,

    CONSTRAINT "EnquiryAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "threshold" INTEGER NOT NULL DEFAULT 0,
    "thresholdType" "ThresholdType" NOT NULL DEFAULT 'monthly',
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" SERIAL NOT NULL,
    "monthYear" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "daysWorked" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLates" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "absences" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "toBeDeductedFromLeaveCredits" INTEGER NOT NULL DEFAULT 0,
    "file" VARCHAR(255),
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaveType_slug_key" ON "LeaveType"("slug");

-- AddForeignKey
ALTER TABLE "EnquiryAttachment" ADD CONSTRAINT "EnquiryAttachment_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryAttachment" ADD CONSTRAINT "EnquiryAttachment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_revisedQuotationReferenceId_fkey" FOREIGN KEY ("revisedQuotationReferenceId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
