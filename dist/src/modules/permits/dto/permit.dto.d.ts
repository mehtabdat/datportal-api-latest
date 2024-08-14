import { ResponseSuccess } from "src/common-types/common-types";
import { Permit } from "../entities/permit.entity";
import { FileVisibility } from "@prisma/client";
export declare class PermitResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Permit;
}
export declare class PermitResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Permit;
}
export declare function getDynamicUploadPath(visibility?: FileVisibility): string;
