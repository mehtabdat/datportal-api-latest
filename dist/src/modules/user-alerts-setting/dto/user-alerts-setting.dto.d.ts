import { ResponseSuccess } from "src/common-types/common-types";
import { UserAlertsSetting } from "../entities/user-alerts-setting.entity";
export declare class UserAlertsSettingResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: UserAlertsSetting;
}
export declare class UserAlertsSettingResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: UserAlertsSetting;
}
