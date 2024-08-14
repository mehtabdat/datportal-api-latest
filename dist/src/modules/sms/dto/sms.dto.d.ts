import { SmsConfiguration } from "@prisma/client";
import { ResponseSuccess } from "src/common-types/common-types";
export declare class SMSResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SmsConfiguration;
}
export declare class SMSResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SmsConfiguration;
}
