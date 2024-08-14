import { Prisma } from '@prisma/client';
export declare enum BlogsSortableFields {
    "addedDate" = "addedDate",
    "title" = "title"
}
export declare class BlogsSortingDto {
    sortByField: BlogsSortableFields;
    sortOrder: Prisma.SortOrder;
}
