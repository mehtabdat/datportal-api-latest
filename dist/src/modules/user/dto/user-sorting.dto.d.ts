import { Prisma } from '@prisma/client';
export declare enum SortableFields {
    "email" = "email",
    "name" = "name",
    "addedDate" = "addedDate"
}
export declare class UserSortingDto {
    sortByField: SortableFields;
    sortOrder: Prisma.SortOrder;
}
