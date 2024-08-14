-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "projectTypeId" INTEGER;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "hasSupervision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supervisionMonthlyCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "supervisionPaymentSchedule" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "QuotationMilestone" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quotationId" INTEGER,

    CONSTRAINT "QuotationMilestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_projectTypeId_fkey" FOREIGN KEY ("projectTypeId") REFERENCES "ProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationMilestone" ADD CONSTRAINT "QuotationMilestone_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
