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
exports.BiometricsJobController = void 0;
const common_1 = require("@nestjs/common");
const biometrics_job_service_1 = require("./biometrics-job.service");
const create_biometrics_job_dto_1 = require("./dto/create-biometrics-job.dto");
const update_biometrics_job_dto_1 = require("./dto/update-biometrics-job.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const biometrics_jobs_dto_1 = require("./dto/biometrics-jobs.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const biometrics_job_permissions_1 = require("./biometrics-job.permissions");
const biometrics_job_filters_dto_1 = require("./dto/biometrics-job-filters.dto");
const biometrics_job_rollback_dto_1 = require("./dto/biometrics-job-rollback.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, biometrics_jobs_dto_1.getDynamicUploadPath)(), fileTypes: 'json_and_excel', limit: 10000000 });
const moduleName = "biometrics-job";
let BiometricsJobController = class BiometricsJobController {
    constructor(biometricsJobService) {
        this.biometricsJobService = biometricsJobService;
    }
    async create(createDto, file) {
        try {
            if (file) {
                createDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.biometricsJobService.create(createDto);
            (0, file_management_1.uploadFile)(file);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(file);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, pagination) {
        try {
            let appliedFilters = this.biometricsJobService.applyFilters(filters);
            let dt = await this.biometricsJobService.findAll(appliedFilters, pagination);
            let tCount = this.biometricsJobService.countRecords(appliedFilters);
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
            console.log(err.message);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.biometricsJobService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async process(params) {
        try {
            let data = await this.biometricsJobService.bulkUploadBiometrics(params.id);
            return { message: `Job processing started`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async stop(params) {
        try {
            let data = await this.biometricsJobService.stopUploadBiometrics(params.id);
            return { message: `Job stopped successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async rollback(params, updateDto) {
        try {
            let data = await this.biometricsJobService.rollback(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.biometricsJobService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.biometricsJobService.remove(params.id);
            return { message: `Job deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_biometrics_job_dto_1.CreateBiometricsJobDto, Object]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [biometrics_job_filters_dto_1.BiometricsJobFilters,
        common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('process/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "process", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('stop/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "stop", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.ROLLBACK),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('rollback/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        biometrics_job_rollback_dto_1.BiometricsJobRollbackDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "rollback", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_biometrics_job_dto_1.UpdateBiometricsJobDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_job_permissions_1.BiometricsJobPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Remove a biometrics job` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_jobs_dto_1.BiometricsJobResponseObject, isArray: false, description: `Returns the lead removed` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BiometricsJobController.prototype, "remove", null);
BiometricsJobController = __decorate([
    (0, swagger_1.ApiTags)("biometrics-job"),
    (0, common_1.Controller)('biometrics-job'),
    __metadata("design:paramtypes", [biometrics_job_service_1.BiometricsJobService])
], BiometricsJobController);
exports.BiometricsJobController = BiometricsJobController;
//# sourceMappingURL=biometrics-job.controller.js.map