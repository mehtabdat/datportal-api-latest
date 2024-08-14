import { Prisma } from "@prisma/client";
export declare class UpdatePayrollDto implements Prisma.PayrollUpdateInput {
    manualCorrection?: number;
    note?: string;
}
