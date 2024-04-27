/*
  Warnings:

  - You are about to drop the column `fulltime` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('entry', 'middle', 'senior', 'no_required');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "fulltime",
ADD COLUMN     "experienceLevel" "ExperienceLevel";
