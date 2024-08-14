import { Account as AccountModel } from "@prisma/client";
export declare class Account implements Partial<AccountModel> {
    id: number;
    accountCode: string;
    xeroReference: string;
    title: string;
    xeroType: string;
    description: string;
    bankAccountNumber: string;
    showInExpenseClaims: boolean;
}
