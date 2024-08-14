import { LeaveCredits } from "@prisma/client";
export declare class LeaveCredit implements LeaveCredits {
    id: number;
    userId: number;
    daysCount: number;
    note: string;
    isDeleted: boolean;
    entryType: number;
    addedDate: Date;
}
