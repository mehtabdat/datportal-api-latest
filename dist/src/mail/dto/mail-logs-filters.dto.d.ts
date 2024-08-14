import { MailSentLogs } from '@prisma/client';
export declare class MailLogsFiltersDto implements Partial<MailSentLogs> {
    fromDate?: string;
    toDate?: string;
    subject?: string;
    email?: string;
    template?: string;
}
