import { ResponseSuccess } from "src/common-types/common-types";
import { UpdateRoleDto } from "./update-role.dto";
export declare class RoleDto extends UpdateRoleDto {
    id?: number;
    addedDate?: Date | string;
    addedBy?: number | null;
    modifiedDate?: Date | string | null;
    modifiedBy?: number | null;
    deletedDate?: Date | string | null;
    deletedBy?: number | null;
}
export declare class RoleResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: RoleDto;
}
export declare class RoleResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: RoleDto;
}
