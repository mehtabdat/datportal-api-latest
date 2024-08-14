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
exports.BulkUploadFormatController = void 0;
const common_1 = require("@nestjs/common");
const bulk_upload_format_service_1 = require("./bulk-upload-format.service");
const create_bulk_upload_format_dto_1 = require("./dto/create-bulk-upload-format.dto");
const update_bulk_upload_format_dto_1 = require("./dto/update-bulk-upload-format.dto");
const bulk_upload_format_dto_1 = require("./dto/bulk-upload-format.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const bulk_upload_format_permissions_1 = require("./bulk-upload-format.permissions");
const moduleName = "bulk-upload-format";
let BulkUploadFormatController = class BulkUploadFormatController {
    constructor(BulkUploadFormatService) {
        this.BulkUploadFormatService = BulkUploadFormatService;
    }
    async create(createBulkUploadFormatDto) {
        try {
            let data = await this.BulkUploadFormatService.create(createBulkUploadFormatDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.BulkUploadFormatService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAllPublished() {
        try {
            let data = await this.BulkUploadFormatService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.BulkUploadFormatService.findOne(params.id);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateBulkUploadFormatDto) {
        try {
            let data = await this.BulkUploadFormatService.update(params.id, updateBulkUploadFormatDto);
            return { message: "Record updated successfully", statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.BulkUploadFormatService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bulk_upload_format_dto_1.CreateBulkUploadFormatDto]),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "findAllPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, update_bulk_upload_format_dto_1.UpdateBulkUploadFormatDto]),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(bulk_upload_format_permissions_1.BulkUploadFormatPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: bulk_upload_format_dto_1.BulkUploadFormatResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BulkUploadFormatController.prototype, "remove", null);
BulkUploadFormatController = __decorate([
    (0, swagger_1.ApiTags)("bulk-upload-format"),
    (0, common_1.Controller)('bulk-upload-format'),
    __metadata("design:paramtypes", [bulk_upload_format_service_1.BulkUploadFormatService])
], BulkUploadFormatController);
exports.BulkUploadFormatController = BulkUploadFormatController;
//# sourceMappingURL=bulk-upload-format.controller.js.map