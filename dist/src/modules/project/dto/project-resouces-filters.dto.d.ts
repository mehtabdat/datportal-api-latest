import { ProjectDocumentsTypes } from "../entities/project.entity";
import { FileTypes } from "src/helpers/file-upload.utils";
export declare class ProjectResourcesFiltersDto {
    fromDate?: string;
    toDate?: string;
    fileName?: string;
    projectId?: number;
    fileType?: keyof typeof FileTypes;
    projectDocumentsTypes?: keyof typeof ProjectDocumentsTypes;
    sharedToClient: boolean;
}
