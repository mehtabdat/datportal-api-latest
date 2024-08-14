import { ResponseSuccess } from "src/common-types/common-types";
import { Transaction } from "../entities/transaction.entity";
export declare class TransactionResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Transaction;
}
export declare class TransactionResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Transaction;
}
export declare function getDynamicUploadPath(): string;
