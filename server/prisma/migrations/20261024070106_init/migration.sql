/*
  Warnings:

  - The `status` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "projectStatus";

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");
