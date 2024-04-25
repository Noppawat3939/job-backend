-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('full_time', 'past_time', 'contract', 'internship');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "Location" TEXT,
ADD COLUMN     "jobType" "JobType";
