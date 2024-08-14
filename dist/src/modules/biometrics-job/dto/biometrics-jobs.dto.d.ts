import { ResponseSuccess } from "src/common-types/common-types";
import { BiometricsJob } from "../entities/biometrics-job.entity";
export declare class BiometricsJobResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BiometricsJob;
}
export declare class BiometricsJobResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: BiometricsJob;
}
export declare function getDynamicUploadPath(): string;
export declare class BiometricsJobProcessEvent {
    biometricsJobId: number;
}
