-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "fulltime" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyHistory" TEXT;
