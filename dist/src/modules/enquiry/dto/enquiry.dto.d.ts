import { ResponseSuccess } from "src/common-types/common-types";
import { Enquiry } from "../entities/enquiry.entity";
import { FileVisibility } from "@prisma/client";
export declare class EnquiryResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Enquiry;
}
export declare class EnquiryResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Enquiry;
}
export declare function getDynamicUploadPath(visibility?: FileVisibility): string;
