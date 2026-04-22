-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_industry_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "industryInsightId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_industryInsightId_fkey" FOREIGN KEY ("industryInsightId") REFERENCES "IndustryInsight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
