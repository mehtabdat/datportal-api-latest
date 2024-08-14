import { CashAdvanceRequest } from "@prisma/client";
export declare class CashAdvance implements Partial<CashAdvanceRequest> {
    id: number;
    requestById: number;
    requestAmount: number;
    purpose: string;
    approvedAmount: number;
    numberOfInstallments: number;
    installmentAmount: number;
    status: number;
    addedDate: Date;
    submittedDate: Date;
}
