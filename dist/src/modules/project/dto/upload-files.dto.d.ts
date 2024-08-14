import { Prisma } from "@prisma/client";
import { ProjectDocumentsTypes } from "../entities/project.entity";
export declare class UploadProjectFiles implements Prisma.FileManagementCreateInput {
    files: string;
    file: string;
    projectId: number;
    documentType: ProjectDocumentsTypes;
    title?: string;
}
