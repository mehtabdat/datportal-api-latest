import { Transactions } from '@prisma/client';
import { TransactionStatus } from 'src/config/constants';
import { TypeFromEnumValues } from 'src/helpers/common';
export declare class TransactionFiltersDto implements Partial<Transactions> {
    __status: TypeFromEnumValues<typeof TransactionStatus>[];
    fromDate?: string;
    toDate?: string;
    projectId: number;
    clientId: number;
    authorityId: number;
    transactionReference?: string;
    onlyGovernmentFees?: boolean;
    onlyInvoicePayments?: boolean;
}
