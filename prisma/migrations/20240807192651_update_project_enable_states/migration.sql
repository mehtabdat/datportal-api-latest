-- DropForeignKey
ALTER TABLE "ProjectEnableStates" DROP CONSTRAINT "ProjectEnableStates_pId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEnableStates_pId_pstateId_key" ON "ProjectEnableStates"("pId", "pstateId");

-- AddForeignKey
ALTER TABLE "ProjectEnableStates" ADD CONSTRAINT "ProjectEnableStates_pId_fkey" FOREIGN KEY ("pId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
