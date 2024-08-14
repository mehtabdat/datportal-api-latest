import { ResponseSuccess } from "src/common-types/common-types";
import { BulkUploadFormat } from "../entities/bulk-upload-format.entity";
export declare class BulkUploadFormatResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BulkUploadFormat;
}
export declare class BulkUploadFormatResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BulkUploadFormat;
}
