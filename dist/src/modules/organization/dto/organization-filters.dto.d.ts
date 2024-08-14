import { Organization } from '@prisma/client';
export declare class OrganizationFiltersDto implements Partial<Organization> {
    email?: string;
    ids?: number[];
    phone?: string;
    status?: number;
    fromDate?: string;
    toDate?: string;
    isPublished?: boolean;
    name?: string;
    location?: number;
    type?: number;
    includeBranches: boolean;
    fetchParentOnly: boolean;
}
