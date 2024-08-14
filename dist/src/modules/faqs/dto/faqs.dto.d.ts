import { ResponseSuccess } from "src/common-types/common-types";
import { Faq } from "../entities/faq.entity";
export declare class FaqsResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Faq;
}
export declare class FaqsResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Faq;
}
export declare function getDynamicUploadPath(): string;
