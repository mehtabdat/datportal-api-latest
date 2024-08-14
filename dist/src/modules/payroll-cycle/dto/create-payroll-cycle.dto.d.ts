import { Prisma } from "@prisma/client";
export declare class CreatePayrollCycleDto implements Prisma.PayrollCycleUncheckedCreateInput {
    fromDate?: Date;
    toDate?: Date;
}
