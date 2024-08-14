import { ResponseSuccess } from "src/common-types/common-types";
import { WorkingHour } from "../entities/working-hour.entity";
export declare class WorkingHourResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: WorkingHour;
}
export declare class WorkingHourResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: WorkingHour;
}
