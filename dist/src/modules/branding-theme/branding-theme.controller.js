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
exports.BrandingThemeController = void 0;
const common_1 = require("@nestjs/common");
const branding_theme_service_1 = require("./branding-theme.service");
const create_branding_theme_dto_1 = require("./dto/create-branding-theme.dto");
const update_branding_theme_dto_1 = require("./dto/update-branding-theme.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const branding_theme_dto_1 = require("./dto/branding-theme.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const branding_theme_permissions_1 = require("./branding-theme.permissions");
const moduleName = "branding-theme";
let BrandingThemeController = class BrandingThemeController {
    constructor(brandingThemeService) {
        this.brandingThemeService = brandingThemeService;
    }
    async create(createDto) {
        try {
            let data = await this.brandingThemeService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.brandingThemeService.findAll({});
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.brandingThemeService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.brandingThemeService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.brandingThemeService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(branding_theme_permissions_1.BrandingThemePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: branding_theme_dto_1.BrandingThemeResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_branding_theme_dto_1.CreateBrandingThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingThemeController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(branding_theme_permissions_1.BrandingThemePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: branding_theme_dto_1.BrandingThemeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandingThemeController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(branding_theme_permissions_1.BrandingThemePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: branding_theme_dto_1.BrandingThemeResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BrandingThemeController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(branding_theme_permissions_1.BrandingThemePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: branding_theme_dto_1.BrandingThemeResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_branding_theme_dto_1.UpdateBrandingThemeDto]),
    __metadata("design:returntype", Promise)
], BrandingThemeController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(branding_theme_permissions_1.BrandingThemePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: branding_theme_dto_1.BrandingThemeResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BrandingThemeController.prototype, "remove", null);
BrandingThemeController = __decorate([
    (0, swagger_1.ApiTags)("branding-theme"),
    (0, common_1.Controller)('branding-theme'),
    __metadata("design:paramtypes", [branding_theme_service_1.BrandingThemeService])
], BrandingThemeController);
exports.BrandingThemeController = BrandingThemeController;
//# sourceMappingURL=branding-theme.controller.js.map