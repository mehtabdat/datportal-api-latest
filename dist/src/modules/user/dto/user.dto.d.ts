import { Prisma } from "@prisma/client";
import { ResponseSuccess } from "src/common-types/common-types";
import { UpdateUserDto } from "./update-user.dto";
export declare class UserDto extends UpdateUserDto {
    id?: number;
    uid?: string;
    addedDate?: Date | string;
    addedBy?: number | null;
    modifiedDate?: Date | string | null;
    modifiedBy?: number | null;
    deletedDate?: Date | string | null;
    deletedBy?: number | null;
}
export declare enum userAttributesTypes {
    PUBLIC = "public",
    PRIVATE = "private",
    LOGIN = "login",
    GENERAL = "general"
}
type UserAttributesTypes = {
    [key: string]: Prisma.UserSelect;
};
export declare const UserDefaultAttributes: Prisma.UserSelect;
export declare const DepartmentDefaultAttributes: Prisma.DepartmentSelect;
export declare const userAttributes: UserAttributesTypes;
export declare function getDynamicUploadPath(visibility: "public" | "organization"): string;
export declare const userFileUploadPath = "public/user";
export declare class UserResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: UserDto;
}
export declare class UserResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: UserDto;
}
export {};
