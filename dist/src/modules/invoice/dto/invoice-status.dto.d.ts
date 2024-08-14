import { InvoiceStatus } from "src/config/constants";
type InvoiceStatusAcceptedType = InvoiceStatus.sent | InvoiceStatus.paid | InvoiceStatus.canceled;
export declare class InvoiceStatusDto {
    status: InvoiceStatusAcceptedType;
    resumeProject: boolean;
}
export {};
