import { Transactions } from "@prisma/client";
export declare class Transaction implements Partial<Transactions> {
    id: number;
    userId: number | null;
    organizationId: number | null;
    amount: number;
    currencyCode: string | null;
    transactionDate: Date;
    transactionType: number;
    recordType: number;
    status: number;
    cartId: string | null;
    transactionReference: string | null;
    transactionUrl: string | null;
    transactionData: any;
    transactionStatus: string | null;
    organizationCreditPackageRefundsId: number | null;
}
