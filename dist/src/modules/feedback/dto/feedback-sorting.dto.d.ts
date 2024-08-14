import { Prisma } from '@prisma/client';
export declare enum FeedbackSortableFields {
    "addedDate" = "addedDate",
    "rating" = "rating"
}
export declare class FeedbackSortingDto {
    sortByField: keyof typeof FeedbackSortableFields;
    sortOrder: Prisma.SortOrder;
}
