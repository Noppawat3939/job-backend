/*
  Warnings:

  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transports" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "urgent" BOOLEAN DEFAULT false;
