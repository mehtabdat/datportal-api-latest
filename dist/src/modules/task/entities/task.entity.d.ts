import { Task as __Task } from "@prisma/client";
export declare class Task implements Partial<__Task> {
    id: number;
    uuid: string;
    projectId: number | null;
    title: string;
    priority: number;
    instructions: string | null;
    taskStartFrom: Date | null;
    taskEndOn: Date | null;
    hasExtendedDate: boolean;
    extendedDate: Date | null;
    reasonOfExtension: string | null;
    addedById: number | null;
    closedById: number | null;
    status: number;
    addedDate: Date;
    isDeleted: boolean;
}
