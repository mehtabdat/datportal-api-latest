import { ResponseSuccess } from "src/common-types/common-types";
import { UpdateSystemModuleDto } from "./update-system-module.dto";
export declare class SystemModuleDto extends UpdateSystemModuleDto {
    id: number;
}
export declare class SystemModuleResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SystemModuleDto;
}
export declare class SystemModuleResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: SystemModuleDto;
}
export declare const systemModulesIconUploadPath = "/public/modules/";
