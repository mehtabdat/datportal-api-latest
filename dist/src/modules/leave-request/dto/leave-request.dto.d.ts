import { ResponseSuccess } from "src/common-types/common-types";
import { LeaveRequest } from "../entities/leave-request.entity";
export declare class LeaveRequestResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveRequest;
}
export declare class LeaveRequestResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveRequest;
}
export declare function getDynamicUploadPath(): string;
