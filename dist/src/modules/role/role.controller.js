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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const role_dto_1 = require("./dto/role.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const role_permissions_1 = require("./role.permissions");
const role_filters_dto_1 = require("./dto/role-filters.dto");
const authorization_service_1 = require("../../authorization/authorization.service");
const role_dashboard_elements_dto_1 = require("./dto/role-dashboard-elements.dto");
const moduleName = "Role(s)";
let RoleController = class RoleController {
    constructor(roleService, authorizationService) {
        this.roleService = roleService;
        this.authorizationService = authorizationService;
    }
    async create(createRoleDto, req) {
        try {
            let data = await this.roleService.create(createRoleDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req) {
        try {
            let filtersApplied = this.roleService.applyFilters(filters, req.user);
            let data = await this.roleService.findAll(filtersApplied, filters);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async addDashboardElement(params, roleDashboardElements, req) {
        try {
            let data = await this.roleService.addDashboardElement(params.id, roleDashboardElements);
            return { message: `Dashboard elements updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeDashboardElement(params, roleDashboardElements, req) {
        try {
            let data = await this.roleService.removeDashboardElement(params.id, roleDashboardElements);
            return { message: `Dashboard elements updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.roleService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateRoleDto, req) {
        try {
            let data = await this.roleService.update(params.id, updateRoleDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.roleService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_filters_dto_1.RoleFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add user roles` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the roles of the user` }),
    (0, common_1.Post)('addDashboardElement/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        role_dashboard_elements_dto_1.RoleDashboardElements, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "addDashboardElement", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Add user roles` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the roles of the user` }),
    (0, common_1.Post)('removeDashboardElement/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        role_dashboard_elements_dto_1.RoleDashboardElements, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "removeDashboardElement", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_role_dto_1.UpdateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(role_permissions_1.RolePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: role_dto_1.RoleResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "remove", null);
RoleController = __decorate([
    (0, swagger_1.ApiTags)("Roles"),
    (0, common_1.Controller)('role'),
    __metadata("design:paramtypes", [role_service_1.RoleService, authorization_service_1.AuthorizationService])
], RoleController);
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map