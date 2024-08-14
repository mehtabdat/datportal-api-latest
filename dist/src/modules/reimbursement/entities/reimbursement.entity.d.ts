import { Reimbursement as __Reimbursement } from "@prisma/client";
export declare class Reimbursement implements Partial<__Reimbursement> {
    id: number;
    claimedAmount: number;
    requestById: number;
    approvedAmount: number;
    purpose: string;
    status: number;
    addedDate: Date;
}
