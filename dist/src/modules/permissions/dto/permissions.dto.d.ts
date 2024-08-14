import { ResponseSuccess } from "src/common-types/common-types";
import { Permission } from "../entities/permission.entity";
export declare class PermissionResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Permission;
}
export declare class PermissionResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Permission;
}
export declare const permissionIconUploadPath = "/public/modules/";
