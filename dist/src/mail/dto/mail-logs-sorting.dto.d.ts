import { Prisma } from '@prisma/client';
export declare enum MailLogsSortableFields {
    "addedDate" = "addedDate"
}
export declare class MailLogsSortingDto {
    sortByField: keyof typeof MailLogsSortableFields;
    sortOrder: Prisma.SortOrder;
}
