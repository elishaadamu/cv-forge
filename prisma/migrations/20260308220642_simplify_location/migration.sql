/*
  Warnings:

  - You are about to drop the column `location` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `JobPosting` table. All the data in the column will be lost.
  - Added the required column `country` to the `JobPosting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPosting" DROP COLUMN "location",
DROP COLUMN "state",
ADD COLUMN     "country" TEXT NOT NULL;
