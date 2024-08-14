import { Prisma } from "@prisma/client";
export declare class CreateTaskDto implements Prisma.TaskUncheckedCreateInput {
    projectId?: number;
    title: string;
    priority?: number;
    instructions?: string;
    taskStartFrom?: string | Date;
    taskEndOn?: string | Date;
    assignedTo?: number[];
    status?: number;
    type?: number;
}
