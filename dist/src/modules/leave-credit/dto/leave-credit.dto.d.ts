import { ResponseSuccess } from "src/common-types/common-types";
import { LeaveCredit } from "../entities/leave-credit.entity";
export declare class LeaveCreditResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveCredit;
}
export declare class LeaveCreditResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: LeaveCredit;
}
