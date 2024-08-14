import { PrismaService } from 'src/prisma.service';
import { SystemLogsType } from './types/system-logs.types';
export declare class SystemLogger {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    logData(systemLogsType: SystemLogsType): Promise<void>;
}
