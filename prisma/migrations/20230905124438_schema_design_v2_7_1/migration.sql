-- AlterTable
ALTER TABLE "EnquiryAttachment" ADD COLUMN     "fileSize" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FileManagement" ADD COLUMN     "fileSize" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FileshareLogs" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "sharedById" INTEGER NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "FileshareLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileshareLogs" ADD CONSTRAINT "FileshareLogs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileshareLogs" ADD CONSTRAINT "FileshareLogs_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileshareLogs" ADD CONSTRAINT "FileshareLogs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileshareLogs" ADD CONSTRAINT "FileshareLogs_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileManagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
