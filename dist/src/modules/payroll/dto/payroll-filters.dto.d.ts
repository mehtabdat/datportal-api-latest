import { Prisma } from "@prisma/client";
export declare class PayrollFiltersDto implements Partial<Prisma.PayrollUncheckedCreateInput> {
    payrollCycleId?: number;
    userId: number;
    fromDate?: string;
    toDate?: string;
}
