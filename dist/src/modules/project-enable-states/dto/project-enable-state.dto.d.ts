import { ResponseSuccess } from "src/common-types/common-types";
import { ProjectEnableState } from "../entities/project-enable-state.entity";
export declare class ProjectEnableStateResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectEnableState;
}
export declare class ProjectEnableStateResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectEnableState;
}
