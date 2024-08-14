

-- AddForeignKey
ALTER TABLE "ProjectEnableStates" ADD CONSTRAINT "ProjectEnableStates_pstateId_fkey" FOREIGN KEY ("pstateId") REFERENCES "ProjectState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
