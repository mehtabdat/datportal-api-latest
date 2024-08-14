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
exports.SystemModulesController = void 0;
const common_1 = require("@nestjs/common");
const system_modules_service_1 = require("./system-modules.service");
const create_system_module_dto_1 = require("./dto/create-system-module.dto");
const update_system_module_dto_1 = require("./dto/update-system-module.dto");
const system_modules_dto_1 = require("./dto/system-modules.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const system_modules_permissions_1 = require("./system-modules.permissions");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const platform_express_1 = require("@nestjs/platform-express");
const system_modules_filters_1 = require("./dto/system-modules.filters");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: system_modules_dto_1.systemModulesIconUploadPath, fileTypes: 'images_only_with_svg' });
const moduleName = "System Module(s)";
let SystemModulesController = class SystemModulesController {
    constructor(systemModulesService) {
        this.systemModulesService = systemModulesService;
    }
    async create(createSystemModuleDto, icon) {
        try {
            if (icon) {
                createSystemModuleDto.icon = (0, file_upload_utils_1.extractRelativePathFromFullPath)(icon.path);
            }
            let data = await this.systemModulesService.create(createSystemModuleDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req) {
        try {
            let data = await this.systemModulesService.findAll(filters, req.user);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            let data = await this.systemModulesService.findOne(params.id, req.user);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateSystemModuleDto, icon) {
        try {
            if (icon) {
                updateSystemModuleDto.icon = (0, file_upload_utils_1.extractRelativePathFromFullPath)(icon.path);
            }
            let data = await this.systemModulesService.update(params.id, updateSystemModuleDto);
            (0, file_management_1.uploadFile)(icon);
            return { message: "Record updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.systemModulesService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_modules_permissions_1.SystemModulesPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon', multerOptions)),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: system_modules_dto_1.SystemModuleResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_system_module_dto_1.CreateSystemModuleDto, Object]),
    __metadata("design:returntype", Promise)
], SystemModulesController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_modules_permissions_1.SystemModulesPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: system_modules_dto_1.SystemModuleResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_modules_filters_1.SystemModuleFilters, Object]),
    __metadata("design:returntype", Promise)
], SystemModulesController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_modules_permissions_1.SystemModulesPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: system_modules_dto_1.SystemModuleResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SystemModulesController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_modules_permissions_1.SystemModulesPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('icon', multerOptions)),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: system_modules_dto_1.SystemModuleResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_system_module_dto_1.UpdateSystemModuleDto, Object]),
    __metadata("design:returntype", Promise)
], SystemModulesController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(system_modules_permissions_1.SystemModulesPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: system_modules_dto_1.SystemModuleResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SystemModulesController.prototype, "remove", null);
SystemModulesController = __decorate([
    (0, swagger_1.ApiTags)("System Modules"),
    (0, common_1.Controller)('system-modules'),
    __metadata("design:paramtypes", [system_modules_service_1.SystemModulesService])
], SystemModulesController);
exports.SystemModulesController = SystemModulesController;
//# sourceMappingURL=system-modules.controller.js.map