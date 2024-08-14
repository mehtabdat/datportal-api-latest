import { SystemLogs } from '@prisma/client';
export declare class SystemLogsFiltersDto implements Partial<SystemLogs> {
    fromDate?: string;
    toDate?: string;
    table?: string;
    tableColumnKey?: string;
    tableColumnValue?: string;
    organizationId?: number;
    addedById?: number;
}
