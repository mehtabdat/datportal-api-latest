import { ResponseSuccess } from "src/common-types/common-types";
import { Attendance } from "../entities/attendance.entity";
export declare class AttendanceResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Attendance;
}
export declare class AttendanceResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Attendance;
}
