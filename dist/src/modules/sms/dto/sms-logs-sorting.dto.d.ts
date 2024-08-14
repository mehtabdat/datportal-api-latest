import { Prisma } from '@prisma/client';
export declare enum SMSLogsSortableFields {
    "sentDate" = "sentDate"
}
export declare class SMSLogsSortingDto {
    sortByField: SMSLogsSortableFields;
    sortOrder: Prisma.SortOrder;
}
