import { ResponseSuccess } from "src/common-types/common-types";
import { ProjectState } from "../entities/project-state.entity";
export declare class ProjectStateResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectState;
}
export declare class ProjectStateResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectState;
}
