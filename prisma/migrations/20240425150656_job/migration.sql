/*
  Warnings:

  - You are about to drop the column `Location` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "Location",
ADD COLUMN     "province" TEXT;
