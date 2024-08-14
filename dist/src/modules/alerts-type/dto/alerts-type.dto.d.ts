import { ResponseSuccess } from "src/common-types/common-types";
import { AlertsType } from "../entities/alerts-type.entity";
export declare class AlertsTypeResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: AlertsType;
}
export declare class AlertsTypeResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: AlertsType;
}
