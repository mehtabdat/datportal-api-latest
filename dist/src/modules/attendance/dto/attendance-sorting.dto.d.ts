import { Prisma } from '@prisma/client';
export declare enum AttendanceSortableFields {
    "checkIn" = "checkIn",
    "addedDate" = "addedDate"
}
export declare class AttendanceSortingDto {
    sortByField: keyof typeof AttendanceSortableFields;
    sortOrder: Prisma.SortOrder;
}
