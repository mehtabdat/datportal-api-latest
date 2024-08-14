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
exports.PermitsController = void 0;
const common_1 = require("@nestjs/common");
const permits_service_1 = require("./permits.service");
const create_permit_dto_1 = require("./dto/create-permit.dto");
const update_permit_dto_1 = require("./dto/update-permit.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const permit_dto_1 = require("./dto/permit.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const permits_permissions_1 = require("./permits.permissions");
const permit_filters_dto_1 = require("./dto/permit-filters.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const constants_1 = require("../../config/constants");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, permit_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "permits";
let PermitsController = class PermitsController {
    constructor(permitsService) {
        this.permitsService = permitsService;
    }
    async create(createDto, files, req) {
        try {
            if (!files || files.length === 0) {
                throw {
                    message: "Please upload permit file",
                    statusCode: 400
                };
            }
            let data = await this.permitsService.create(createDto);
            await this.permitsService.handleDocuments(data, files, req.user);
            await (0, file_management_1.uploadFile)(files);
            let updatedRecord = await this.permitsService.findOne(data.id);
            if (createDto.clientStatus && createDto.clientStatus === constants_1.PermitClientStatus.sent) {
                this.permitsService.markAllPermitAsSent(updatedRecord, req.user);
            }
            return { message: `${moduleName} created successfully`, statusCode: 200, data: updatedRecord };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.permitsService.applyFilters(filters);
            let dt = this.permitsService.findAll(appliedFilters, pagination);
            let tCount = this.permitsService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
    async findOne(params) {
        try {
            let data = await this.permitsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, files, req) {
        try {
            let data = await this.permitsService.update(params.id, updateDto);
            if (files && files.length > 0) {
                await this.permitsService.handleDocuments(data, files, req.user);
                await (0, file_management_1.uploadFile)(files);
                data = await this.permitsService.findOne(data.id);
                if (updateDto.clientStatus && updateDto.clientStatus === constants_1.PermitClientStatus.sent) {
                    this.permitsService.markAllPermitAsSent(data, req.user);
                }
            }
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.permitsService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permits_permissions_1.PermitPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permit_dto_1.PermitResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permit_dto_1.CreatePermitDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], PermitsController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permits_permissions_1.PermitPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permit_dto_1.PermitResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [permit_filters_dto_1.PermitFiltersDto,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], PermitsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permits_permissions_1.PermitPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permit_dto_1.PermitResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PermitsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permits_permissions_1.PermitPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permit_dto_1.PermitResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_permit_dto_1.UpdatePermitDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], PermitsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(permits_permissions_1.PermitPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: permit_dto_1.PermitResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PermitsController.prototype, "remove", null);
PermitsController = __decorate([
    (0, swagger_1.ApiTags)("permits"),
    (0, common_1.Controller)('permits'),
    __metadata("design:paramtypes", [permits_service_1.PermitsService])
], PermitsController);
exports.PermitsController = PermitsController;
//# sourceMappingURL=permits.controller.js.map