import { ResponseSuccess } from "src/common-types/common-types";
import { ProjectComponent } from "../entities/project-component.entity";
export declare class ProjectComponentResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectComponent;
}
export declare class ProjectComponentResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: ProjectComponent;
}
