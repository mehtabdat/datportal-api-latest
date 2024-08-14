import { ResponseSuccess } from "src/common-types/common-types";
import { CashAdvance } from "../entities/cash-advance.entity";
export declare class CashAdvanceResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CashAdvance;
}
export declare class CashAdvanceResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CashAdvance;
}
export declare function getDynamicUploadPath(): string;
