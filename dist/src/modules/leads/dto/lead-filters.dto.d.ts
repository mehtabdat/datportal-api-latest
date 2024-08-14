import { Leads } from '@prisma/client';
export declare class LeadsFiltersDto implements Partial<Leads> {
    __status?: number[];
    fromDate?: string;
    toDate?: string;
    clientId?: number;
    enquiryId?: number;
    assignedToId?: number;
    representativeId?: number;
    projectTypeId?: number;
    fetchCompleted?: boolean;
    hasConcerns?: boolean;
}
