-- AlterTable
ALTER TABLE "Leads" ALTER COLUMN "message" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enableRemoteCheckin" BOOLEAN NOT NULL DEFAULT false;
