/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('applied', 'rejected');

-- DropTable
DROP TABLE "Job";

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN,
    "position" TEXT NOT NULL,
    "style" "WorkStyle",
    "company" TEXT NOT NULL,
    "industry" TEXT,
    "companyProfile" TEXT,
    "location" TEXT,
    "salary" INTEGER[],
    "urgent" BOOLEAN DEFAULT false,
    "jobDescriptions" TEXT[],
    "qualifications" TEXT[],
    "benefits" TEXT[],
    "contracts" TEXT[],
    "transports" TEXT[],
    "jobStartTime" TIMESTAMP(3),
    "jobEndTime" TIMESTAMP(3),
    "jobType" "JobType",
    "province" TEXT,
    "category" TEXT,
    "experienceLevel" "ExperienceLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppliedJob" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "applicationDate" TIMESTAMP(3),
    "applicationStatus" "ApplicationStatus",

    CONSTRAINT "AppliedJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppliedJob" ADD CONSTRAINT "AppliedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedJob" ADD CONSTRAINT "AppliedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
