-- AlterTable
ALTER TABLE "BiometricsChecks" ADD COLUMN     "userAgent" VARCHAR(255),
ADD COLUMN     "userIP" VARCHAR(100);

-- AlterTable
ALTER TABLE "EnquiryAttachment" ADD COLUMN     "syncWithProject" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "workingHoursId" INTEGER;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dataAccessRestrictedTo" INTEGER[];

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "hours" JSONB,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "WorkingHours"("id") ON DELETE SET NULL ON UPDATE CASCADE;
