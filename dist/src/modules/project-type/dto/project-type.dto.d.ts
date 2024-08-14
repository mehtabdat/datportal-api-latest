import { ResponseSuccess } from "src/common-types/common-types";
import { ProjectType } from "../entities/project-type.entity";
export declare class ProjectTypeResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectType;
}
export declare class ProjectTypeResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectType;
}
