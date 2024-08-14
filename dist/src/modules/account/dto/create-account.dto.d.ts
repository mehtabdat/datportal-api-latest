import { Prisma } from "@prisma/client";
export declare class CreateAccountDto implements Prisma.AccountUncheckedCreateInput {
    accountCode: string;
    title?: string;
    xeroType?: string;
    description?: string;
    bankAccountNumber?: string;
    showInExpenseClaims?: boolean;
}
