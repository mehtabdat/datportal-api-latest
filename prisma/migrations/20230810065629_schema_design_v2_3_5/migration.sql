-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "hasSupervisionCharge" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Leads" ADD COLUMN     "submissionById" INTEGER;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "taxRegistrationNumber" VARCHAR(50);

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_submissionById_fkey" FOREIGN KEY ("submissionById") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
