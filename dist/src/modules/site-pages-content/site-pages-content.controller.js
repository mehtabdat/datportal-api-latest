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
exports.SitePagesContentController = void 0;
const common_1 = require("@nestjs/common");
const site_pages_content_service_1 = require("./site-pages-content.service");
const create_site_pages_content_dto_1 = require("./dto/create-site-pages-content.dto");
const update_site_pages_content_dto_1 = require("./dto/update-site-pages-content.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const site_pages_content_dto_1 = require("./dto/site-pages-content.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const site_pages_content_permissions_1 = require("./site-pages-content.permissions");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: site_pages_content_dto_1.sitePagesContentFileUploadPath, fileTypes: 'images_only_with_svg' });
const moduleName = "Site pages content";
let SitePagesContentController = class SitePagesContentController {
    constructor(sitePagesContentService) {
        this.sitePagesContentService = sitePagesContentService;
    }
    async create(createSitePagesContentDto, image) {
        try {
            if (image) {
                createSitePagesContentDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(image.path);
            }
            let sectionData = await this.sitePagesContentService.getSectionData(createSitePagesContentDto.pageSectionId);
            if (!sectionData.hasMultipleItems) {
                let existingData = await this.sitePagesContentService.checkIfSectionHasContentForCountry(sectionData.id);
                if (existingData) {
                    throw { message: "This page section allows only single item, please change to multiple items if you want to add more items to the section", statusCode: 400 };
                }
            }
            let data = await this.sitePagesContentService.create(createSitePagesContentDto);
            (0, file_management_1.uploadFile)(image);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.sitePagesContentService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAllByPageSection(params) {
        try {
            let data = await this.sitePagesContentService.findAllByPageSection(params.id);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.sitePagesContentService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateSitePagesContentDto, image) {
        try {
            if (image) {
                updateSitePagesContentDto.image = (0, file_upload_utils_1.extractRelativePathFromFullPath)(image.path);
            }
            let data = await this.sitePagesContentService.update(params.id, updateSitePagesContentDto);
            (0, file_management_1.uploadFile)(image);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.sitePagesContentService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_pages_content_dto_1.CreateSitePagesContentDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('pageContentByCategory/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "findAllByPageSection", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_site_pages_content_dto_1.UpdateSitePagesContentDto, Object]),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(site_pages_content_permissions_1.SitePagesContentPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: site_pages_content_dto_1.SitePagesContentResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], SitePagesContentController.prototype, "remove", null);
SitePagesContentController = __decorate([
    (0, swagger_1.ApiTags)("site-pages-content"),
    (0, common_1.Controller)('site-pages-content'),
    __metadata("design:paramtypes", [site_pages_content_service_1.SitePagesContentService])
], SitePagesContentController);
exports.SitePagesContentController = SitePagesContentController;
//# sourceMappingURL=site-pages-content.controller.js.map