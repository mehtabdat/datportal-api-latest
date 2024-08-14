import { ResponseSuccess } from "src/common-types/common-types";
import { Lead } from "../entities/lead.entity";
import { FileVisibility, Prisma } from "@prisma/client";
export declare class LeadsResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Lead;
}
export declare class LeadsResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Lead;
}
export declare function getDynamicUploadPath(visibility?: FileVisibility): string;
export declare const LeadsDefaultAttributes: Prisma.LeadsSelect;
