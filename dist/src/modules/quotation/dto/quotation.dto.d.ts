import { ResponseSuccess } from "src/common-types/common-types";
import { Quotation } from "../entities/quotation.entity";
export declare class QuotationResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Quotation;
}
export declare class QuotationResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Quotation;
}
export declare function getDynamicUploadPath(): string;
