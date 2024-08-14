/*
  Warnings:

  - You are about to drop the column `assetDetail` on the `AssetAllocation` table. All the data in the column will be lost.
  - You are about to drop the column `assetName` on the `AssetAllocation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssetAllocation" DROP COLUMN "assetDetail",
DROP COLUMN "assetName",
ADD COLUMN     "companyAssetId" INTEGER,
ADD COLUMN     "label" VARCHAR(255);

-- CreateTable
CREATE TABLE "CompanyAsset" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "type" INTEGER NOT NULL DEFAULT 1,
    "assetName" VARCHAR(255),
    "assetDetail" VARCHAR(255),
    "quantity" INTEGER DEFAULT 1,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CompanyAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_companyAssetId_fkey" FOREIGN KEY ("companyAssetId") REFERENCES "CompanyAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
