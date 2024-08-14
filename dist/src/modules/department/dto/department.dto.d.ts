import { ResponseSuccess } from "src/common-types/common-types";
import { Department } from "../entities/department.entity";
export declare class DepartmentResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Department;
}
export declare class DepartmentResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Department;
}
