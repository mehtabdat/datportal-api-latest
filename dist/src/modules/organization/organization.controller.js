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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const update_organization_dto_1 = require("./dto/update-organization.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const organization_dto_1 = require("./dto/organization.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const organization_permissions_1 = require("./organization.permissions");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const organization_pagination_dto_1 = require("./dto/organization-pagination.dto");
const organization_sorting_dto_1 = require("./dto/organization-sorting.dto");
const organization_filters_dto_1 = require("./dto/organization-filters.dto");
const authorization_service_1 = require("../../authorization/authorization.service");
const constants_1 = require("../../config/constants");
const public_metadata_1 = require("../../authentication/public-metadata");
const mail_service_1 = require("../../mail/mail.service");
const suspend_organization_dto_1 = require("./dto/suspend-organization.dto");
const organization_meta_dto_1 = require("./dto/organization-meta.dto");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, organization_dto_1.getDynamicUploadPath)('public') });
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, organization_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "organization";
let OrganizationController = class OrganizationController {
    constructor(organizationService, authorizationService, mailService) {
        this.organizationService = organizationService;
        this.authorizationService = authorizationService;
        this.mailService = mailService;
    }
    async create(createOrganizationDto, files, req) {
        try {
            if (files.logo && files.logo.length > 0) {
                createOrganizationDto.logo = (0, file_upload_utils_1.extractRelativePathFromFullPath)(files.logo[0].path);
                (0, file_management_1.uploadFile)(files.logo);
            }
            if (files.digitalStamp && files.digitalStamp.length > 0) {
                createOrganizationDto.digitalStamp = (0, file_upload_utils_1.extractRelativePathFromFullPath)(files.digitalStamp[0].path);
                (0, file_management_1.uploadFile)(files.digitalStamp);
            }
            let data = await this.organizationService.create(createOrganizationDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files === null || files === void 0 ? void 0 : files.logo);
            (0, file_upload_utils_1.removeUploadedFiles)(files === null || files === void 0 ? void 0 : files.digitalStamp);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(pagination, sorting, filters, fetchMeta, req) {
        try {
            let filtersApplied = this.organizationService.applyFilters(filters);
            let dt = this.organizationService.findAll(pagination, sorting, filtersApplied, fetchMeta);
            let tCount = this.organizationService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
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
    async findAllPublished(pagination, sorting, filters, req) {
        try {
            filters.isPublished = true;
            filters["isDeleted"] = false;
            let filtersApplied = this.organizationService.applyFilters(filters);
            let dt = this.organizationService.findAllPublished(pagination, sorting, filtersApplied);
            let tCount = this.organizationService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName}(s) fetched Successfully`, statusCode: 200, data: data,
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
    async findOneByUUID(params) {
        try {
            let data = await this.organizationService.findOneByUUID(params.uuid);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateOrganizationDto, files, req) {
        try {
            if (files.logo && files.logo.length > 0) {
                updateOrganizationDto.logo = (0, file_upload_utils_1.extractRelativePathFromFullPath)(files.logo[0].path);
                (0, file_management_1.uploadFile)(files.logo);
            }
            if (files.digitalStamp && files.digitalStamp.length > 0) {
                updateOrganizationDto.digitalStamp = (0, file_upload_utils_1.extractRelativePathFromFullPath)(files.digitalStamp[0].path);
                (0, file_management_1.uploadFile)(files.digitalStamp);
            }
            updateOrganizationDto["modifiedDate"] = new Date();
            updateOrganizationDto["modifiedById"] = req.user.userId;
            let data = await this.organizationService.update(params.id, updateOrganizationDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files === null || files === void 0 ? void 0 : files.logo);
            (0, file_upload_utils_1.removeUploadedFiles)(files === null || files === void 0 ? void 0 : files.digitalStamp);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let data = await this.organizationService.remove(params.id, req.user.userId);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async suspendOrganization(req, params, suspendOrganizationDto) {
        try {
            let organizationOldData = await this.organizationService.findOne(params.id);
            if (organizationOldData.status === constants_1.OrganizationStatus.suspended) {
                throw { message: "You can only suspend the active organization", statusCode: 400 };
            }
            let organization = await this.organizationService.suspendOrganization(params.id);
            return { message: `Organization suspended successfully`, statusCode: 200, data: organization };
        }
        catch (err) {
            throw new common_1.HttpException({ message: err.message, error: err.data, statusCode: err.statusCode }, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.organizationService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'logo', maxCount: 1 },
        { name: 'digitalStamp', maxCount: 1 },
    ], multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_pagination_dto_1.OrganizationPaginationDto,
        organization_sorting_dto_1.OrganizationSortingDto,
        organization_filters_dto_1.OrganizationFiltersDto,
        organization_meta_dto_1.OrganizationMetaDataDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findAll", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName}(s) in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseArray, isArray: false, description: `Return a list of ${moduleName}(s) available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_pagination_dto_1.OrganizationPaginationDto,
        organization_sorting_dto_1.OrganizationSortingDto,
        organization_filters_dto_1.OrganizationFiltersDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findAllPublished", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('find-by-uuid/:uuid'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.FindOrgByUUID]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOneByUUID", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'logo', maxCount: 1 },
        { name: 'digitalStamp', maxCount: 1 },
    ], multerOptions)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_organization_dto_1.UpdateOrganizationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.SUSPEND),
    (0, swagger_1.ApiOperation)({ summary: `Suspend the organization to add perform any actions` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Suspend the organization to add perform any actions` }),
    (0, common_1.Patch)('suspendOrganization/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, params_dto_1.ParamsDto,
        suspend_organization_dto_1.SuspendOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "suspendOrganization", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(organization_permissions_1.OrganizationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: organization_dto_1.OrganizationResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOne", null);
OrganizationController = __decorate([
    (0, swagger_1.ApiTags)("organization"),
    (0, common_1.Controller)('organization'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService,
        authorization_service_1.AuthorizationService,
        mail_service_1.MailService])
], OrganizationController);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map