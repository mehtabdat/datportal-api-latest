import { UserMetaKeys } from "../types/user.types";
export declare class UserMeta {
    key: keyof typeof UserMetaKeys;
    value: any;
}
export declare class UpdateUserMetaDto {
    userMeta: Array<UserMeta>;
}
export declare class DeleteUserMetaDto {
    id: number;
}
export declare class DeleteUserMetaByKeyDto {
    key: keyof typeof UserMetaKeys;
}
