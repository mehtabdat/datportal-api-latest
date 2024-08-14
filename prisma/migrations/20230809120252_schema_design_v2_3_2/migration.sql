-- AlterTable
ALTER TABLE "QuotationMilestone" ADD COLUMN     "completedById" INTEGER;

-- AddForeignKey
ALTER TABLE "QuotationMilestone" ADD CONSTRAINT "QuotationMilestone_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
