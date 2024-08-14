-- AlterTable
ALTER TABLE "BiometricsJob" ADD COLUMN     "comment" VARCHAR(255),
ADD COLUMN     "title" VARCHAR(255),
ALTER COLUMN "file" DROP NOT NULL;
