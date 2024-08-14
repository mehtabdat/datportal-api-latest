import { QuotationStatus } from "src/config/constants";
type QuotationStatusAcceptedType = QuotationStatus.confirmed | QuotationStatus.rejected;
export declare class QuotationStatusDto {
    status: QuotationStatusAcceptedType;
}
export {};
