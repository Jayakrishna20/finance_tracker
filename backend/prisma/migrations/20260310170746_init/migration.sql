-- CreateTable
CREATE TABLE "Categories" (
    "categoryId" BIGSERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryType" BIGINT NOT NULL,
    "categoryColorCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionId" BIGSERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" BIGINT NOT NULL,
    "description" TEXT,
    "categoryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "Credits" (
    "creditId" BIGSERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "amount" BIGINT NOT NULL,
    "billedDate" TIMESTAMP(3) NOT NULL,
    "lastPaymentDate" TIMESTAMP(3) NOT NULL,
    "paidStatus" BOOLEAN NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credits_pkey" PRIMARY KEY ("creditId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_categoryName_key" ON "Categories"("categoryName");

-- CreateIndex
CREATE INDEX "Transactions_date_idx" ON "Transactions"("date");

-- CreateIndex
CREATE INDEX "Transactions_transactionId_idx" ON "Transactions"("transactionId");

-- CreateIndex
CREATE INDEX "Credits_categoryId_idx" ON "Credits"("categoryId");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;
