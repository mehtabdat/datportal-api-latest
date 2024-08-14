import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
    truncate(): Promise<void>;
    truncateTable(tablename: any): Promise<void>;
    resetSequences(): Promise<void>;
}
