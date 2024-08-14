-- CreateEnum
CREATE TYPE "NotificationMode" AS ENUM ('auto', 'manual');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "mode" "NotificationMode" NOT NULL DEFAULT 'auto';
