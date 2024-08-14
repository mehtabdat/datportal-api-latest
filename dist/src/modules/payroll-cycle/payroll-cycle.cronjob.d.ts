import { Queue } from 'bull';
import { PrismaService } from 'src/prisma.service';
export declare class PayrollCycleCronJob {
    private payrollQueue;
    private readonly prisma;
    private readonly logger;
    constructor(payrollQueue: Queue, prisma: PrismaService);
    preparePayrollReport(): Promise<void>;
}
