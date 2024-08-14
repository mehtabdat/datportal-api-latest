import { ResponseSuccess } from "src/common-types/common-types";
import { Biometric } from "../entities/biometric.entity";
export declare class BiometricsResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Biometric;
}
export declare class BiometricsResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Biometric;
}
export declare function getDynamicUploadPath(visibility: "public" | "protected"): string;
