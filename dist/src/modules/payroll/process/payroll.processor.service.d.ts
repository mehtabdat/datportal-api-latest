import { PrismaService } from "src/prisma.service";
import { PayrollCycle, Prisma, WorkingHours } from "@prisma/client";
export declare class PayrollProcessorService {
    private prisma;
    private readonly logger;
    private totalRecords;
    private failedRecords;
    private failedReport;
    constructor(prisma: PrismaService);
    preparePayrollReportofAllUser(payrollCycle: PayrollCycle): Promise<void>;
    preparePayrollReportOfUser(payrollCycle: PayrollCycle, userId: number, salary: number, salaryId: number, workingHour: WorkingHours, payrollId?: number): Promise<void | Prisma.BatchPayload>;
    findIfWeekendIsPaid(userId: number, processingDate: Date): Promise<boolean>;
    findIfHolidayIsPaid(userId: number, processingDate: Date): Promise<boolean>;
}
