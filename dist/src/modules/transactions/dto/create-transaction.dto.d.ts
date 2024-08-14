import { Prisma } from "@prisma/client";
import { TransactionStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class CreateTransactionDto implements Prisma.TransactionsUncheckedCreateInput {
    title?: string;
    remarks?: string;
    projectId?: number;
    authorityId?: number;
    invoiceId?: number;
    amount?: number;
    transactionDate?: string;
    transactionReference?: string;
    status: TypeFromEnumValues<typeof TransactionStatus>;
    receipt: string;
}
