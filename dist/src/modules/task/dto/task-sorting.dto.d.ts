import { Prisma } from '@prisma/client';
export declare enum TaskSortableFields {
    "addedDate" = "addedDate",
    "priority" = "priority",
    "order" = "order",
    "taskEndOn" = "taskEndOn"
}
export declare class TaskSortingDto {
    sortByField: TaskSortableFields;
    sortOrder: Prisma.SortOrder;
}
