-- CreateEnum
CREATE TYPE "WorkStyle" AS ENUM ('remote', 'work_from_home', 'on_site', 'hybrid');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "active" BOOLEAN,
ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "style" "WorkStyle";
