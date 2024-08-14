-- AlterTable
ALTER TABLE "ProjectEnableStates" 
ALTER COLUMN "pId" SET NOT NULL;

-- Drop the existing column pstateId
ALTER TABLE "ProjectEnableStates"
DROP COLUMN "pstateId";

-- Add the new column pstateId with the correct type
ALTER TABLE "ProjectEnableStates"
ADD COLUMN "pstateId" INTEGER NOT NULL;

-- Create unique indexes
-- CREATE UNIQUE INDEX "ProjectEnableStates_pId_key" ON "ProjectEnableStates"("pId");

-- CREATE UNIQUE INDEX "ProjectEnableStates_pstateId_key" ON "ProjectEnableStates"("pstateId");

-- CREATE UNIQUE INDEX "ProjectEnableStates_pId_pstateId_key" ON "ProjectEnableStates"("pId", "pstateId");

-- Add foreign key constraints
-- ALTER TABLE "ProjectEnableStates" 
-- ADD CONSTRAINT "ProjectEnableStates_pId_fkey" 
-- FOREIGN KEY ("pId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ALTER TABLE "ProjectEnableStates" 
-- ADD CONSTRAINT "ProjectEnableStates_pstateId_fkey" 
-- FOREIGN KEY ("pstateId") REFERENCES "ProjectState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Check for duplicates in pId
SELECT "pId", COUNT(*) 
FROM "ProjectEnableStates" 
GROUP BY "pId" 
HAVING COUNT(*) > 1;

-- Check for duplicates in pstateId
SELECT "pstateId", COUNT(*) 
FROM "ProjectEnableStates" 
GROUP BY "pstateId"
HAVING COUNT(*) > 1;

-- Check for duplicates in the combination of pId and pstateId
SELECT "pId", "pstateId", COUNT(*) 
FROM "ProjectEnableStates" 
GROUP BY "pId", "pstateId" 
HAVING COUNT(*) > 1;

-- Find rows with null pId
SELECT * 
FROM "ProjectEnableStates" 
WHERE "pId" IS NULL;


-- Example of removing duplicates (this will need to be adjusted as per your data context)
DELETE FROM "ProjectEnableStates" 
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT "id", ROW_NUMBER() OVER (PARTITION BY "pId", "pstateId" ORDER BY "id") AS rnum
    FROM "ProjectEnableStates"
  ) t
  WHERE t.rnum > 1
);
