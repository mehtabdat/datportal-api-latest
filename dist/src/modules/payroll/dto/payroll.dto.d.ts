import { ResponseSuccess } from "src/common-types/common-types";
import { Payroll } from "../entities/payroll.entity";
export declare class PayrollResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Payroll;
}
export declare class PayrollResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Payroll;
}
export declare function getDynamicUploadPath(): string;
