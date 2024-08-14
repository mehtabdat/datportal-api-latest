import { FileVisibility, Prisma } from "@prisma/client";
import { ResponseSuccess } from "src/common-types/common-types";
import { Project } from "../entities/project.entity";
export declare class ProjectImages implements Prisma.FileManagementCreateInput {
    id: number;
    uuid?: string;
    file: string;
    name: string;
    isTemp?: boolean;
}
export declare function getDynamicUploadPath(visibility?: FileVisibility): string;
export declare class ProjectResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Project;
}
export declare class ProjectResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Project;
}
export declare class ProjectImagesResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectImages;
}
export declare const ProjectDefaultAttributes: Prisma.ProjectSelect;
