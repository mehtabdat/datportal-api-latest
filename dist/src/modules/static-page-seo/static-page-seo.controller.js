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
exports.StaticPageSeoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const static_page_seo_service_1 = require("./static-page-seo.service");
const create_static_page_seo_dto_1 = require("./dto/create-static-page-seo.dto");
const update_static_page_seo_dto_1 = require("./dto/update-static-page-seo.dto");
const static_page_seo_dto_1 = require("./dto/static-page-seo.dto");
const params_dto_1 = require("./dto/params.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const static_page_seo_permissions_1 = require("./static-page-seo.permissions");
const file_management_1 = require("../../helpers/file-management");
const public_metadata_1 = require("../../authentication/public-metadata");
const static_page_seo_pagination_dto_1 = require("./dto/static-page-seo.pagination.dto");
const static_page_seo_filters_dto_1 = require("./dto/static-page-seo-filters.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: static_page_seo_dto_1.StaticPageSEOFileUploadPath });
let StaticPageSeoController = class StaticPageSeoController {
    constructor(staticPageSeoService) {
        this.staticPageSeoService = staticPageSeoService;
    }
    async create(createStaticPageSeoDto, image, req) {
        try {
            if (image) {
                createStaticPageSeoDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(image.path);
            }
            let data = await this.staticPageSeoService.create(createStaticPageSeoDto);
            (0, file_management_1.uploadFile)(image);
            return { message: "StaticPageSEO data saved successfully", statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(image);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(req, staticPageSEOFiltersDto, pagination) {
        try {
            let appliedFilters = this.staticPageSeoService.applyFilters(staticPageSEOFiltersDto);
            let dt = this.staticPageSeoService.findAll(appliedFilters, pagination);
            let tCount = this.staticPageSeoService.countStaticPageSEO({});
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: "StaticPageSEO fetched Successfully", statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(req, pagination) {
        try {
            let dt = this.staticPageSeoService.findAll({}, pagination);
            let tCount = this.staticPageSeoService.countStaticPageSEO({});
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: "StaticPageSEO fetched Successfully", statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async makeDefault(params, req) {
        try {
            let data = await this.staticPageSeoService.makeDefault(params.id);
            return { message: "StaticPageSEO updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateStaticPageSeoDto, image, req) {
        try {
            if (image) {
                updateStaticPageSeoDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(image.path);
            }
            updateStaticPageSeoDto['modifiedById'] = req.user.userId;
            updateStaticPageSeoDto['modifiedDate'] = new Date();
            let data = await this.staticPageSeoService.update(params.id, updateStaticPageSeoDto);
            (0, file_management_1.uploadFile)(image);
            return { message: "StaticPageSEO updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.staticPageSeoService.remove(params.id);
            return { message: "StaticPageSEO deleted successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOneByPageSlug(params, req) {
        try {
            let data = await this.staticPageSeoService.findOneByPageSlug(params.slug);
            return { message: "StaticPageSEO data Fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.staticPageSeoService.findOne(params.id);
            return { message: "StaticPageSEO data Fetched Successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new static-page-seo in the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseObject, isArray: false, description: 'Returns the new record on success' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_static_page_seo_dto_1.CreateStaticPageSeoDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all StaticPageSEO data from the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseArray, isArray: false, description: 'Returns the list of county in the system' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, static_page_seo_filters_dto_1.StaticPageSEOFiltersDto,
        static_page_seo_pagination_dto_1.StaticPageSEOPaginationDto]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "findAll", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all StaticPageSEO data from the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseArray, isArray: false, description: 'Returns the list of county in the system' }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, static_page_seo_pagination_dto_1.StaticPageSEOPaginationDto]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "findPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Make page SEO default for all pages' }),
    (0, common_1.Patch)('make-default/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "makeDefault", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: 'Update StaticPageSEO', description: "Only the white listed fields are considered, other fields are striped out by default" }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseObject, isArray: false, description: 'Returns the updated StaticPageSEO object if found on the system' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, update_static_page_seo_dto_1.UpdateStaticPageSeoDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'Delete StaticPageSEO' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseObject, isArray: false, description: 'Returns the deleted StaticPageSEO object if found on the system' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "remove", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch StaticPageSEO by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseObject, isArray: false, description: 'Returns the StaticPageSEO object if found on the system' }),
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.FindItemBySlug, Object]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "findOneByPageSlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(static_page_seo_permissions_1.StaticPageSEOPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch StaticPageSEO by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: static_page_seo_dto_1.StaticPageSEOResponseObject, isArray: false, description: 'Returns the StaticPageSEO object if found on the system' }),
    (0, common_1.Get)('findById/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], StaticPageSeoController.prototype, "findOne", null);
StaticPageSeoController = __decorate([
    (0, swagger_1.ApiTags)("static-page-seo"),
    (0, common_1.Controller)('static-page-seo'),
    __metadata("design:paramtypes", [static_page_seo_service_1.StaticPageSeoService])
], StaticPageSeoController);
exports.StaticPageSeoController = StaticPageSeoController;
//# sourceMappingURL=static-page-seo.controller.js.map