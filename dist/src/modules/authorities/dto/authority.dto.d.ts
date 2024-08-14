import { ResponseSuccess } from "src/common-types/common-types";
import { Authority } from "../entities/authority.entity";
import { Prisma } from "@prisma/client";
export declare class AuthorityResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Authority;
}
export declare class AuthorityResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Authority;
}
export declare const AuthorityDefaultAttributes: Prisma.AuthoritiesSelect;
