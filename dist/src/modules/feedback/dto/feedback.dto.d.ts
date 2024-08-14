import { ResponseSuccess } from "src/common-types/common-types";
import { Feedback } from "../entities/feedback.entity";
export declare class FeedbackResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Feedback;
}
export declare class FeedbackResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Feedback;
}
export declare function getDynamicUploadPath(): string;
