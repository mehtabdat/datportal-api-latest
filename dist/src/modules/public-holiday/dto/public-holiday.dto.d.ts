import { ResponseSuccess } from "src/common-types/common-types";
import { PublicHoliday } from "../entities/public-holiday.entity";
export declare class PublicHolidayResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PublicHoliday;
}
export declare class PublicHolidayResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PublicHoliday;
}
