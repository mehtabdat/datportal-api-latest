import { Job } from 'bull';
import { PayrollProcessorService } from './payroll.processor.service';
import { PayrollCycle } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export declare class PayrollProcessor {
    private readonly payrollProcessorService;
    private readonly prisma;
    private readonly logger;
    constructor(payrollProcessorService: PayrollProcessorService, prisma: PrismaService);
    preparePayrollReport(job: Job<{
        data: PayrollCycle;
    }>): Promise<void>;
    preparePayrollReportOfUser(job: Job<{
        data: {
            PayrollCycle: PayrollCycle;
            userId: number;
            salary: number;
            salaryId: number;
            payrollId?: number;
        };
    }>): Promise<void | import(".prisma/client").Prisma.BatchPayload>;
    globalHandler(job: Job): void;
}
