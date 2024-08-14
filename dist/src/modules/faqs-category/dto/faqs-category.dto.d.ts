import { ResponseSuccess } from "src/common-types/common-types";
import { FaqsCategory } from "../entities/faqs-category.entity";
export declare class FaqsCategoryResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: FaqsCategory;
}
export declare class FaqsCategoryResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: FaqsCategory;
}
