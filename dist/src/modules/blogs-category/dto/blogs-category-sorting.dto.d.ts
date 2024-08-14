import { Prisma } from '@prisma/client';
export declare enum BlogsCategorySortableFields {
    "addedDate" = "addedDate",
    "title" = "title"
}
export declare class BlogsCategorySortingDto {
    sortByField: BlogsCategorySortableFields;
    sortOrder: Prisma.SortOrder;
}
