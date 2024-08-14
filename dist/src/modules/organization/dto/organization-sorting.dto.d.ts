import { Prisma } from '@prisma/client';
export declare enum SortableFields {
    "email" = "email",
    "addedDate" = "addedDate"
}
export declare class OrganizationSortingDto {
    sortByField: SortableFields;
    sortOrder: Prisma.SortOrder;
}
