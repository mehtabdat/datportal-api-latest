import { Prisma } from "@prisma/client";
export declare class ReimbursementReceipts implements Prisma.ReimbursementReceiptUncheckedCreateInput {
    file: string;
    title?: string;
    claimedAmount: number;
}
export declare class CreateReimbursementDto implements Prisma.ReimbursementUncheckedCreateInput {
    purpose?: string;
    reimbursementReceipts: Array<ReimbursementReceipts>;
}
