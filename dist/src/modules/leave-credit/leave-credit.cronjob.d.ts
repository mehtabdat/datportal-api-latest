import { PrismaService } from 'src/prisma.service';
export declare class LeaveCreditCronJob {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    addLeaveCreditsReport(): Promise<void>;
}
