import { SmsLogs } from '@prisma/client';
export declare class SMSLogsFiltersDto implements Partial<SmsLogs> {
    fromDate?: string;
    toDate?: string;
    message?: string;
    userId?: number;
    gateway?: string;
    number?: string;
    status?: string;
}
