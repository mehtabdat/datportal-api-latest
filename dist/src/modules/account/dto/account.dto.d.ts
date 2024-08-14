import { ResponseSuccess } from "src/common-types/common-types";
import { Account } from "../entities/account.entity";
export declare class AccountResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Account;
}
export declare class AccountResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Account;
}
