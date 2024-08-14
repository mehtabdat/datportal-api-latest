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
exports.SitePagesSectionController = void 0;
const common_1 = require("@nestjs/common");
const site_pages_section_service_1 = require("./site-pages-section.service");
const create_site_pages_section_dto_1 = require("./dto/create-site-pages-section.dto");
const update_site_pages_section_dto_1 = require("./dto/update-site-pages-section.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const site_pages_section_dto_1 = require("./dto/site-pages-section.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const site_pages_section_permissions_1 = require("./site-pages-section.permissions");
const site_pages_section_filters_dto_1 = require("./dto/site-pages-section-filters.dto");
const moduleName = "site pages section";
let SitePagesSectionController = class SitePagesSectionController {
    constructor(sitePagesSectionService) {
        this.sitePagesSectionService = sitePagesSectionService;
    }
    async create(createSitePagesSectionDto, req) {
        try {
            let data = await this.sitePagesSectionService.create(createSitePagesSectionDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters) {
        try {
            let filtersApplied = this.sitePagesSectionService.applyFilters(filters);
            let data = await this.sitePagesSectionService.findAll(filtersApplied);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.sitePagesSectionService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async allowMultiples(params, req) {
        try {
            let updateSitePagesSectionDto = new update_site_pages_section_dto_1.UpdateSitePagesSectionDto();
            updateSitePagesSectionDto["hasMultipleItems"] = true;
            let data = await this.sitePagesSectionService.update(params.id, updateSitePagesSectionDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async disallowMultiples(params, req) {
        try {
            let existingItems = await this.sitePagesSectionService.findAllContentOfSection(params.id);
            let hasUniqueItems = true;
            for (let ele of existingItems) {
                if (ele._count.id > 1) {
                    hasUniqueItems = false;
                    break;
                }
            }
            if (!hasUniqueItems) {
                throw { message: "This section already has multiple sections uploaded please delete the existing sections first and try again", statusCode: 400 };
            }
            let updateSitePagesSectionDto = new update_site_pages_section_dto_1.UpdateSitePagesSectionDto();
            updateSitePagesSectionDto["hasMultipleItems"] = false;
            let data = await this.sitePagesSectionService.update(params.id, updateSitePagesSectionDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateSitePagesSectionDto, req) {
        try {
            let data = await this.sitePagesSectionService.update(params.id, updateSitePagesSectionDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.sitePagesSectionService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_pages_section_dto_1.CreateSitePagesSectionDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_pages_section_filters_dto_1.SitePagesSectionFiltersDto]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('allowMultiples/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "allowMultiples", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('disallowMultiples/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "disallowMultiples", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_site_pages_section_dto_1.UpdateSitePagesSectionDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_section_permissions_1.SitePagesSectionPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_section_dto_1.SitePagesSectionResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesSectionController.prototype, "remove", null);
SitePagesSectionController = __decorate([
    (0, swagger_1.ApiTags)("site-pages-section"),
    (0, common_1.Controller)('site-pages-section'),
    __metadata("design:paramtypes", [site_pages_section_service_1.SitePagesSectionService])
], SitePagesSectionController);
exports.SitePagesSectionController = SitePagesSectionController;
//# sourceMappingURL=site-pages-section.controller.js.map