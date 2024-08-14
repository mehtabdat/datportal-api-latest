import { ResponseSuccess } from "src/common-types/common-types";
import { LeaveType } from "../entities/leave-type.entity";
export declare class LeaveTypeResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveType;
}
export declare class LeaveTypeResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveType;
}
