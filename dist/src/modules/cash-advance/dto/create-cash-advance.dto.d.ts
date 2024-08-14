import { Prisma } from "@prisma/client";
export declare class CreateCashAdvanceDto implements Prisma.CashAdvanceRequestUncheckedCreateInput {
    requestAmount?: number;
    purpose?: string;
    files?: string;
}
