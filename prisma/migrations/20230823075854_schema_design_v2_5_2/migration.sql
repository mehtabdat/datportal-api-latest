-- AlterTable
ALTER TABLE "FileManagement" ADD COLUMN     "projectConversationId" INTEGER;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "projectId" INTEGER;

-- AddForeignKey
ALTER TABLE "FileManagement" ADD CONSTRAINT "FileManagement_projectConversationId_fkey" FOREIGN KEY ("projectConversationId") REFERENCES "ProjectConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
