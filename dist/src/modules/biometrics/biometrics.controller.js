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
exports.BiometricsController = void 0;
const common_1 = require("@nestjs/common");
const biometrics_service_1 = require("./biometrics.service");
const create_biometric_dto_1 = require("./dto/create-biometric.dto");
const update_biometric_dto_1 = require("./dto/update-biometric.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const biometrics_dto_1 = require("./dto/biometrics.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const biometrics_permissions_1 = require("./biometrics.permissions");
const biometrics_filters_dto_1 = require("./dto/biometrics-filters.dto");
const public_metadata_1 = require("../../authentication/public-metadata");
const helpers_1 = require("../../helpers/helpers");
const biometrics_authorization_service_1 = require("./biometrics.authorization.service");
const checkin_checkout_biometric_dto_1 = require("./dto/checkin-checkout-biometric.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const moduleName = "biometrics";
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, biometrics_dto_1.getDynamicUploadPath)('protected'), fileTypes: 'all_files', limit: 10000000 });
let BiometricsController = class BiometricsController {
    constructor(biometricsService, authorizationService) {
        this.biometricsService = biometricsService;
        this.authorizationService = authorizationService;
    }
    async createData(req) {
        try {
            console.log("Body", req.body);
            console.log("Params", req.params);
            console.log("Query", req.query);
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            console.log("userAgent", userAgent);
            console.log("clientIPAddress", clientIPAddress);
            let data = "";
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async createDataTest(req) {
        try {
            console.log("Body Get", req.body);
            console.log("Params", req.params);
            console.log("Query", req.query);
            let userAgent = req.headers["user-agent"];
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            console.log("userAgent", userAgent);
            console.log("clientIPAddress", clientIPAddress);
            let data = "";
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async create(createDto, req) {
        try {
            let data = await this.biometricsService.create(createDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async checkInCheckout(createDto, selfie, req) {
        try {
            if (!selfie) {
                throw {
                    message: "Please upload a selfie image",
                    statusCode: 400
                };
            }
            if (selfie) {
                createDto.selfie = (0, file_upload_utils_1.extractRelativePathFromFullPath)(selfie.path);
            }
            createDto.checkIn = new Date();
            let userAgent = req.headers["user-agent"];
            if (userAgent) {
                createDto.userAgent = userAgent.slice(0, 250);
            }
            let clientIPAddress = (0, helpers_1.findClientIpAddress)(req);
            if (clientIPAddress) {
                createDto.userIP = clientIPAddress;
            }
            await this.biometricsService.validateCheckInCheckOut(createDto, req.user);
            let data = await this.biometricsService.checkInCheckOut(createDto, req.user);
            (0, file_management_1.uploadFile)(selfie);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(selfie);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getTodayCheckInCheckOut(req) {
        try {
            let data = await this.biometricsService.getTodayCheckInCheckOut(req.user.userId);
            return { message: `Biometrics Data of today for the userId ${req.user.userId} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [biometrics_permissions_1.BiometricsPermissionSet.READ_ALL]);
            if (!permissions.readAllBiometrics) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.biometricsService.applyFilters(filters);
            let dt = await this.biometricsService.findAll(appliedFilters, pagination);
            let tCount = this.biometricsService.countRecords(appliedFilters);
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
    async findOne(params, req) {
        try {
            await this.authorizationService.isAuthorizedForBiometrics(params.id, req.user);
            let data = await this.biometricsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, req) {
        try {
            let data = await this.biometricsService.update(params.id, updateDto, req.user);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async delete(params) {
        try {
            let data = await this.biometricsService.delete(params.id);
            return { message: `${moduleName}  deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "createData", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Get)('test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "createDataTest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_permissions_1.BiometricsPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_biometric_dto_1.CreateBiometricDto, Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('checkInCheckout'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('selfie', multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkin_checkout_biometric_dto_1.CheckInCheckOutBiometricDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "checkInCheckout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('todayCheckInCheckOut'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "getTodayCheckInCheckOut", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_permissions_1.BiometricsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [biometrics_filters_dto_1.BiometricsFilters, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_permissions_1.BiometricsPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_permissions_1.BiometricsPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_biometric_dto_1.UpdateBiometricDto, Object]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(biometrics_permissions_1.BiometricsPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName} ` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: biometrics_dto_1.BiometricsResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], BiometricsController.prototype, "delete", null);
BiometricsController = __decorate([
    (0, swagger_1.ApiTags)("biometrics"),
    (0, common_1.Controller)('biometrics'),
    __metadata("design:paramtypes", [biometrics_service_1.BiometricsService, biometrics_authorization_service_1.BiometricsAuthorizationService])
], BiometricsController);
exports.BiometricsController = BiometricsController;
//# sourceMappingURL=biometrics.controller.js.map