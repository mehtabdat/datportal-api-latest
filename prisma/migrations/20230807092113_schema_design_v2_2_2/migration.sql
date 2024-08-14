/*
  Warnings:

  - You are about to drop the column `date` on the `CarReservationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `prupose` on the `CarReservationRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CarReservationRequest" DROP COLUMN "date",
DROP COLUMN "prupose",
ADD COLUMN     "fromDate" TIMESTAMP(3),
ADD COLUMN     "purpose" VARCHAR(500),
ADD COLUMN     "toDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "designation" VARCHAR(255),
    "phone" VARCHAR(20),
    "phoneCode" VARCHAR(5),
    "whatsapp" VARCHAR(20),
    "email" VARCHAR(255),
    "address" VARCHAR(255),
    "companyId" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_uuid_key" ON "Client"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
