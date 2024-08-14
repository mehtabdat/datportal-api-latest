import { Enquiry } from '@prisma/client';
import { EnquirySource } from 'src/config/constants';
export declare class EnquiryFiltersDto implements Partial<Enquiry> {
    email?: string;
    phone?: string;
    status?: number;
    fromDate?: string;
    toDate?: string;
    name?: string;
    source?: keyof typeof EnquirySource;
    userAgent?: string;
    userIP?: string;
    hasConcerns?: boolean;
    assignedToId?: number;
}
