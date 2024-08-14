import { Invoice } from "@prisma/client";
import { ResponseSuccess } from "src/common-types/common-types";
import { Followup } from "../entities/followup.entity";
export declare class InvoiceResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Invoice;
}
export declare class InvoiceResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Invoice;
}
export declare class FollowupResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Followup;
}
export declare function getDynamicUploadPath(): string;
