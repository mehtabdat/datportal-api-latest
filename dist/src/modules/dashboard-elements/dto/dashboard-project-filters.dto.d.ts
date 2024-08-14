import { Project } from "@prisma/client";
export declare class ProjectFiltersDto implements Partial<Project> {
    projectStateId?: number;
    projectStateSlugs?: string[];
    isClosed?: boolean;
    delayed?: boolean;
    onHold?: boolean;
    userIds?: number[];
    projectRole?: number;
    fromDate?: Date;
}
