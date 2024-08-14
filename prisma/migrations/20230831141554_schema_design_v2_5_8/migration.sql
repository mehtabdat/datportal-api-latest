-- CreateTable
CREATE TABLE "ProjectConversationReadLog" (
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectConversationReadLog_conversationId_userId_key" ON "ProjectConversationReadLog"("conversationId", "userId");

-- AddForeignKey
ALTER TABLE "ProjectConversationReadLog" ADD CONSTRAINT "ProjectConversationReadLog_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ProjectConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectConversationReadLog" ADD CONSTRAINT "ProjectConversationReadLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
