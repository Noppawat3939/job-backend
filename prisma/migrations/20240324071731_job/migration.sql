-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "industry" TEXT,
    "companyProfile" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "jobDescriptions" TEXT[],
    "qualifications" TEXT[],
    "contracts" TEXT[],
    "userId" INTEGER,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
