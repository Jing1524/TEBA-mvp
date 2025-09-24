-- CreateEnum
CREATE TYPE "public"."Direction" AS ENUM ('debit', 'credit');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Merchant" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "normalizedName" TEXT,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "rawDescription" TEXT NOT NULL,
    "direction" "public"."Direction" NOT NULL,
    "merchantId" TEXT,
    "categoryId" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enrichmentVersion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amountCents" INTEGER NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Insight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutboxEvent" (
    "id" BIGSERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" BIGSERIAL NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" TEXT NOT NULL,
    "refId" TEXT,
    "payload" JSONB NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_normalizedName_key" ON "public"."Merchant"("normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_code_key" ON "public"."Category"("code");

-- CreateIndex
CREATE INDEX "Transaction_accountId_postedAt_idx" ON "public"."Transaction"("accountId", "postedAt" DESC);

-- CreateIndex
CREATE INDEX "Transaction_categoryId_postedAt_idx" ON "public"."Transaction"("categoryId", "postedAt" DESC);

-- CreateIndex
CREATE INDEX "Transaction_merchantId_postedAt_idx" ON "public"."Transaction"("merchantId", "postedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_postedAt_amountCents_rawDescription_key" ON "public"."Transaction"("accountId", "postedAt", "amountCents", "rawDescription");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_categoryId_month_key" ON "public"."Budget"("userId", "categoryId", "month");

-- CreateIndex
CREATE INDEX "OutboxEvent_processedAt_idx" ON "public"."OutboxEvent"("processedAt");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
