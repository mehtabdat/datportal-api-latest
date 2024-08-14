/// <reference types="multer" />
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ParamsDto } from './dto/params.dto';
import { ResponseError, ResponseSuccess } from 'src/common-types/common-types';
import { GrantPrivilegesDto } from './dto/grant-privileges.dto';
import { AuthenticatedRequest } from 'src/authentication/authenticated-request';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { GetRolePermission } from './dto/get-role-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    private readonly authorizationService;
    constructor(permissionsService: PermissionsService, authorizationService: AuthorizationService);
    permissionSets(): ResponseSuccess | ResponseError;
    grantPrivilegesToRole(grantPrivilegesDto: GrantPrivilegesDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    revokePrivilegesFromRole(grantPrivilegesDto: GrantPrivilegesDto, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getRolePermissions(params: GetRolePermission, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    getRolePermissionsForModule(params: GetRolePermission, req: AuthenticatedRequest): Promise<ResponseSuccess | ResponseError>;
    create(createPermissionDto: CreatePermissionDto, icon: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    findAll(): Promise<ResponseSuccess | ResponseError>;
    findOne(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
    update(params: ParamsDto, updatePermissionDto: UpdatePermissionDto, icon: Express.Multer.File): Promise<ResponseSuccess | ResponseError>;
    remove(params: ParamsDto): Promise<ResponseSuccess | ResponseError>;
}
