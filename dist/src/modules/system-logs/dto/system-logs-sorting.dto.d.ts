import { Prisma } from '@prisma/client';
export declare enum SystemLogsSortableFields {
    "addedDate" = "addedDate"
}
export declare class SystemLogsSortingDto {
    sortByField: keyof typeof SystemLogsSortableFields;
    sortOrder: Prisma.SortOrder;
}
