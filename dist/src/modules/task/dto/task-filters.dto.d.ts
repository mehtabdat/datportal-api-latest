import { TaskType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare enum TaskAssignedType {
    "assignedTask" = "assignedTask",
    "myTask" = "myTask"
}
export declare class TaskFilters {
    projectId: number;
    status: number;
    userIds?: number[];
    type: keyof typeof TaskAssignedType;
    taskType?: TypeFromEnumValues<typeof TaskType>;
}
