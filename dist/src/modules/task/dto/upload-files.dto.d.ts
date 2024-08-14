import { Prisma } from "@prisma/client";
export declare class UploadTaskFiles implements Prisma.FileManagementUncheckedCreateInput {
    files: string;
    file: string;
    taskId: number;
    title?: string;
}
