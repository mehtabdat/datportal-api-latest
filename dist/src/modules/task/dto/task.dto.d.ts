import { ResponseSuccess } from "src/common-types/common-types";
import { Task } from "../entities/task.entity";
import { FileVisibility } from "@prisma/client";
export declare class TaskResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Task;
}
export declare class TaskResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Task;
}
export declare function getDynamicUploadPath(visibility?: FileVisibility): string;
