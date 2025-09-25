/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "month" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "postedAt" SET DATA TYPE DATE;

-- CreateIndex
CREATE UNIQUE INDEX "Account_code_key" ON "public"."Account"("code");
