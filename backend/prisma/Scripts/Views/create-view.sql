DROP VIEW IF EXISTS "TransactionView";
DROP VIEW IF EXISTS "CreditView";

CREATE VIEW "TransactionView" AS
SELECT
  t."transactionId",
  t."amount",
  t."date",
  t."description",
  c."categoryId",
  c."categoryName",
  c."categoryColorCode"
FROM "Transactions" t
JOIN "Categories" c ON t."categoryId" = c."categoryId"

CREATE VIEW "CreditView" AS
SELECT
  c."creditId",
  c."amount",
  c."billedDate",
  c."lastPaymentDate",
  c."paidStatus",
  c."paymentDate",
  c."description",
  ct."categoryId",
  ct."categoryName",
  ct."categoryColorCode"
FROM "Credits" c
JOIN "Categories" ct ON c."categoryId" = ct."categoryId"