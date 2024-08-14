import { Prisma } from "@prisma/client";
export declare class Payroll implements Partial<Prisma.PayrollUncheckedCreateInput> {
    id: number;
    monthYear: Date;
    userId: number;
    salaryId: number;
    payrollCycleId: number;
    totalWorkingDays: number;
    daysWorked: number;
    totalLates: number;
    totalIncompletes: number;
    toBeDeductedFromCurrentSalary?: number;
    toBeDeductedFromLeaveCredits?: number;
    totalAbsences?: number;
    totalDeduction?: number;
    totalReceivable?: number;
}
