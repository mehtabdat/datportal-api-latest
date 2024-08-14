import { ResponseSuccess } from "src/common-types/common-types";
import { TaxRate } from "../entities/tax-rate.entity";
export declare class TaxRateResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: TaxRate;
}
export declare class TaxRateResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: TaxRate;
}
