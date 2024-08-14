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
exports.SitePagesController = void 0;
const common_1 = require("@nestjs/common");
const site_pages_service_1 = require("./site-pages.service");
const create_site_page_dto_1 = require("./dto/create-site-page.dto");
const update_site_page_dto_1 = require("./dto/update-site-page.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const site_pages_dto_1 = require("./dto/site-pages.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const site_pages_permissions_1 = require("./site-pages.permissions");
const site_pages_filters_dto_1 = require("./dto/site-pages-filters.dto");
const public_metadata_1 = require("../../authentication/public-metadata");
const moduleName = "site pages";
let SitePagesController = class SitePagesController {
    constructor(sitePagesService) {
        this.sitePagesService = sitePagesService;
    }
    async create(createSitePageDto, req) {
        try {
            let data = await this.sitePagesService.create(createSitePageDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters) {
        try {
            let filtersApplied = this.sitePagesService.applyFilters(filters);
            let data = await this.sitePagesService.findAll(filtersApplied);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPageContent(params, req) {
        try {
            let pageData = await this.sitePagesService.findPageBySlug(params.slug);
            if (!pageData) {
                throw { message: "Site Page with provided slug not found", statusCode: 404 };
            }
            let pageSectionAndContent = this.sitePagesService.findPageContent(pageData.id);
            let pageSeoData = this.sitePagesService.findPageSeo(pageData.id);
            let [pageSectionData, seoData] = await Promise.all([pageSectionAndContent, pageSeoData]);
            let __pageSectionData = pageSectionData.map((ele) => ele.PageSection);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: {
                    pageSections: __pageSectionData,
                    seoMeta: seoData
                } };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.sitePagesService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateSitePageDto, req) {
        try {
            let data = await this.sitePagesService.update(params.id, updateSitePageDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeSectionFromPage(params, req) {
        try {
            let data = await this.sitePagesService.removeSectionFromPage(params.pageId, params.sectionId);
            return { message: `Section From page has been deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeMultipleSectionFromPage(removeRelationDto, req) {
        try {
            let data = await this.sitePagesService.removeMultipleSectionFromPage(removeRelationDto.pageId, removeRelationDto.sectionIds);
            return { message: `Section From page has been deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.sitePagesService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_page_dto_1.CreateSitePageDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [site_pages_filters_dto_1.SitePagesFiltersDto]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "findAll", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('find-page-content/:slug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.DataBySlugDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "findPageContent", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_site_page_dto_1.UpdateSitePageDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName} section` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the deleted ${moduleName} relation object if found on the system` }),
    (0, common_1.Delete)('removeSectionFromPage/:pageId/:sectionId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.RemoveRelationDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "removeSectionFromPage", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName} section` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the deleted ${moduleName} relation object if found on the system` }),
    (0, common_1.Delete)('removeMultipleSectionFromPage'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.RemoveMultipleRelationDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "removeMultipleSectionFromPage", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_permissions_1.SitePagesPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_dto_1.SitePageResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesController.prototype, "remove", null);
SitePagesController = __decorate([
    (0, swagger_1.ApiTags)("site-pages"),
    (0, common_1.Controller)('site-pages'),
    __metadata("design:paramtypes", [site_pages_service_1.SitePagesService])
], SitePagesController);
exports.SitePagesController = SitePagesController;
//# sourceMappingURL=site-pages.controller.js.map