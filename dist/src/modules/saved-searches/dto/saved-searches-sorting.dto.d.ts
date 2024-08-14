import { Prisma } from '@prisma/client';
export declare enum SavedSearchesSortableFields {
    "addedDate" = "addedDate"
}
export declare class SavedSearchesSortingDto {
    sortByField: SavedSearchesSortableFields;
    sortOrder: Prisma.SortOrder;
}
