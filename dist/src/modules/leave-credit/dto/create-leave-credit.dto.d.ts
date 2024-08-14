import { Prisma } from "@prisma/client";
export declare class CreateLeaveCreditDto implements Prisma.LeaveCreditsUncheckedCreateInput {
    userId: number;
    daysCount?: number;
    note?: string;
}
