import { Prisma } from '@prisma/client';
export declare enum TransactionSortableFields {
    "amount" = "amount",
    "transactionDate" = "transactionDate"
}
export declare class TransactionSortingDto {
    sortByField: TransactionSortableFields;
    sortOrder: Prisma.SortOrder;
}
