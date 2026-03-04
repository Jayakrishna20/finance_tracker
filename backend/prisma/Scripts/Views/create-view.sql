DROP VIEW IF EXISTS "TransactionView";

CREATE VIEW "TransactionView" AS
SELECT
  t."transactionId",
  t."amount",
  t."date",
  t."description",
  c."categoryId",
  c."categoryName",
  c."categoryColorCode",
  ct."categoryTypeName"
FROM "Transactions" t
JOIN "Categories" c ON t."categoryId" = c."categoryId"
JOIN "CategoryTypes" ct ON c."categoryType" = ct."categoryTypeId";
