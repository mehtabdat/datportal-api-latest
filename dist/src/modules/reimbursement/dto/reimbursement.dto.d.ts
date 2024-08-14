import { ResponseSuccess } from "src/common-types/common-types";
import { Reimbursement } from "../entities/reimbursement.entity";
export declare class ReimbursementResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Reimbursement;
}
export declare class ReimbursementResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Reimbursement;
}
export declare function getDynamicUploadPath(): string;
