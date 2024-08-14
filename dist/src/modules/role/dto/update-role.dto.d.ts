import { CreateRoleDto } from './create-role.dto';
declare const UpdateRoleDto_base: import("@nestjs/common").Type<Partial<Omit<CreateRoleDto, "copyRoleId">>>;
export declare class UpdateRoleDto extends UpdateRoleDto_base {
    isDeleted?: boolean;
}
export {};
