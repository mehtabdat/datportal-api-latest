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
exports.ReimbursementController = void 0;
const common_1 = require("@nestjs/common");
const reimbursement_service_1 = require("./reimbursement.service");
const create_reimbursement_dto_1 = require("./dto/create-reimbursement.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const reimbursement_dto_1 = require("./dto/reimbursement.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const reimbursement_permissions_1 = require("./reimbursement.permissions");
const reimbursement_filters_dto_1 = require("./dto/reimbursement-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const reimbursement_hr_action_dto_1 = require("./dto/reimbursement-hr-action.dto");
const reimbursement_finance_action_dto_1 = require("./dto/reimbursement-finance-action.dto");
const reimbursement_authorization_service_1 = require("./reimbursement.authorization.service");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, reimbursement_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "reimbursement";
let receipts = [...Array(20)].map((item, i) => {
    return {
        name: "reimbursementReceipts[" + i + "][file]",
        maxCount: 1
    };
});
let ReimbursementController = class ReimbursementController {
    constructor(reimbursementService, reimbursementAuthorizationService) {
        this.reimbursementService = reimbursementService;
        this.reimbursementAuthorizationService = reimbursementAuthorizationService;
    }
    async create(createDto, files, req) {
        let allFiles = [];
        try {
            Object.entries(files).map((key, value) => {
                allFiles.push(key[1][0]);
            });
            if (allFiles.length !== createDto.reimbursementReceipts.length) {
                throw {
                    message: "Recipt count does not equals receipt data. Please upload all receipts",
                    statusCode: 400
                };
            }
            let data = await this.reimbursementService.create(createDto, req.user);
            await this.reimbursementService.handleFiles(data.id, createDto.reimbursementReceipts, files, req.user);
            (0, file_management_1.uploadFile)(allFiles);
            let recordData = await this.reimbursementService.findOne(data.id);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: recordData };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(allFiles);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.reimbursementAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL, reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL]);
            if (!permissions.reimbursementFinanceApproval && !permissions.reimbursementHRApproval) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.reimbursementService.applyFilters(filters, permissions);
            let dt = await this.reimbursementService.findAll(appliedFilters, pagination);
            let tCount = this.reimbursementService.countRecords(appliedFilters);
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
    async readOwnRequest(filters, req, pagination) {
        try {
            filters.userId = req.user.userId;
            let appliedFilters = this.reimbursementService.applyFilters(filters);
            let dt = await this.reimbursementService.findAll(appliedFilters, pagination);
            let tCount = this.reimbursementService.countRecords(appliedFilters);
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
            let permissions = await this.reimbursementAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL, reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL]);
            if (!permissions.reimbursementFinanceApproval && !permissions.reimbursementHRApproval) {
                await this.reimbursementAuthorizationService.isAuthorizedForReimbursement(params.id, req.user);
            }
            let data = await this.reimbursementService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async withdraw(params, req) {
        try {
            await this.reimbursementAuthorizationService.isAuthorizedForReimbursement(params.id, req.user);
            let data = await this.reimbursementService.withdraw(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async hrAction(params, reimbursementHrAction, req) {
        try {
            let data = await this.reimbursementService.hrUpdate(params.id, reimbursementHrAction, req.user);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async financeAction(params, reimbursementAction, req) {
        try {
            let data = await this.reimbursementService.financeUpdate(params.id, reimbursementAction, req.user);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            await this.reimbursementAuthorizationService.isAuthorizedForReimbursement(params.id, req.user);
            let data = await this.reimbursementService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)(receipts, multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reimbursement_dto_1.CreateReimbursementDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reimbursement_filters_dto_1.ReimbursementFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('own'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reimbursement_filters_dto_1.ReimbursementFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "readOwnRequest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw reimbursement` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('withdraw/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "withdraw", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.HR_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw reimbursement` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('hrAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        reimbursement_hr_action_dto_1.ReimbursementHrAction, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "hrAction", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.FINANCE_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw reimbursement` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('financeAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        reimbursement_finance_action_dto_1.ReimbursementFinanceAction, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "financeAction", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(reimbursement_permissions_1.ReimbursementPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: reimbursement_dto_1.ReimbursementResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], ReimbursementController.prototype, "remove", null);
ReimbursementController = __decorate([
    (0, swagger_1.ApiTags)("reimbursement"),
    (0, common_1.Controller)('reimbursement'),
    __metadata("design:paramtypes", [reimbursement_service_1.ReimbursementService, reimbursement_authorization_service_1.ReimbursementAuthorizationService])
], ReimbursementController);
exports.ReimbursementController = ReimbursementController;
//# sourceMappingURL=reimbursement.controller.js.map