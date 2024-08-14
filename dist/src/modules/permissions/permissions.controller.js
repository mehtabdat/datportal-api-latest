"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const update_permission_dto_1 = require("./dto/update-permission.dto");
const permissions_dto_1 = require("./dto/permissions.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const grant_privileges_dto_1 = require("./dto/grant-privileges.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const permissions_permissions_1 = require("./permissions.permissions");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const authorization_service_1 = require("../../authorization/authorization.service");
const get_role_permission_dto_1 = require("./dto/get-role-permission.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: permissions_dto_1.permissionIconUploadPath, fileTypes: 'images_only_with_svg' });
const moduleName = "Permission(s)";
let PermissionsController = class PermissionsController {
    constructor(permissionsService, authorizationService) {
        this.permissionsService = permissionsService;
        this.authorizationService = authorizationService;
    }
    permissionSets() {
        return {
            message: `Permissions Set Fetched Successfully`, statusCode: 200,
            data: permissions_permissions_1.permissionSets
        };
    }
    async grantPrivilegesToRole(grantPrivilegesDto, req) {
        try {
            let data = await this.permissionsService.grantPrivilegesToRole(grantPrivilegesDto.roleId, grantPrivilegesDto.permissionIds, req.user);
            return { message: `Permission added to the given roleId successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async revokePrivilegesFromRole(grantPrivilegesDto, req) {
        try {
            let data = await this.permissionsService.revokePrivilegesFromRole(grantPrivilegesDto.roleId, grantPrivilegesDto.permissionIds, req.user);
            return { message: `Permission revoked from the given roleId successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getRolePermissions(params, req) {
        try {
            let data = await this.permissionsService.getRolePermission(params.roleId);
            return { message: `Permission fetched for the given roleId successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getRolePermissionsForModule(params, req) {
        try {
            let data = await this.permissionsService.getRolePermissionByModuleId(params.roleId, params.moduleId);
            return { message: `Permission fetched for the given roleId and moduleId successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async create(createPermissionDto, icon) {
        try {
            if (icon) {
                createPermissionDto.icon = (0, file_upload_utils_1.extractRelativePathFromFullPath)(icon.path);
            }
            let data = await this.permissionsService.create(createPermissionDto);
            (0, file_management_1.uploadFile)(icon);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.permissionsService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.permissionsService.findOne(params.id);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updatePermissionDto, icon) {
        try {
            if (icon) {
                updatePermissionDto.icon = (0, file_upload_utils_1.extractRelativePathFromFullPath)(icon.path);
            }
            let data = await this.permissionsService.update(params.id, updatePermissionDto);
            (0, file_management_1.uploadFile)(icon);
            return { message: "Record updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.permissionsService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.VIEW_PERMISSIONS_LIST),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all permissions required to permission an action on respective modules` }),
    (0, swagger_1.ApiResponse)({ status: 200, description: `Returns all permissions required to permission an action on respective modules` }),
    (0, common_1.Get)('system-permissions-set'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PermissionsController.prototype, "permissionSets", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.GRANT),
    (0, swagger_1.ApiOperation)({ summary: `Grant privileges to role` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the number of records added` }),
    (0, common_1.Post)('grantPrivilegesToRole'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grant_privileges_dto_1.GrantPrivilegesDto, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "grantPrivilegesToRole", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.REVOKE),
    (0, swagger_1.ApiOperation)({ summary: `Revoke privileges from role` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the privileges removed` }),
    (0, common_1.Post)('revokePrivilegesFromRole'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grant_privileges_dto_1.GrantPrivilegesDto, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "revokePrivilegesFromRole", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.READ_ROLE_PERMISSIONS),
    (0, common_1.Get)('getRolePermissions/:roleId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_role_permission_dto_1.GetRolePermission, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getRolePermissions", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.READ_ROLE_PERMISSIONS),
    (0, common_1.Get)('getRolePermissions/:roleId/:moduleId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_role_permission_dto_1.GetRolePermission, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getRolePermissionsForModule", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_permission_dto_1.UpdatePermissionDto, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permissions_permissions_1.PermissionsPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permissions_dto_1.PermissionResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "remove", null);
PermissionsController = __decorate([
    (0, swagger_1.ApiTags)("Permissions"),
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService, authorization_service_1.AuthorizationService])
], PermissionsController);
exports.PermissionsController = PermissionsController;
//# sourceMappingURL=permissions.controller.js.map