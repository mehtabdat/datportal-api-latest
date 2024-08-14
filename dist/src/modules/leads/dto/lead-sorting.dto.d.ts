import { Prisma } from '@prisma/client';
export declare enum LeadsSortableFields {
    "email" = "email",
    "name" = "name",
    "addedDate" = "addedDate"
}
export declare class LeadsSortingDto {
    sortByField: keyof typeof LeadsSortableFields;
    sortOrder: Prisma.SortOrder;
}
