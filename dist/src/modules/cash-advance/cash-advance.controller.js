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
exports.CashAdvanceController = void 0;
const common_1 = require("@nestjs/common");
const cash_advance_service_1 = require("./cash-advance.service");
const create_cash_advance_dto_1 = require("./dto/create-cash-advance.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const cash_advance_dto_1 = require("./dto/cash-advance.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const cash_advance_permissions_1 = require("./cash-advance.permissions");
const cash_advance_filters_dto_1 = require("./dto/cash-advance-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const cash_advance_hr_action_dto_1 = require("./dto/cash-advance-hr-action.dto");
const cash_advance_finance_action_dto_1 = require("./dto/cash-advance-finance-action.dto");
const cash_advance_authorization_service_1 = require("./cash-advance.authorization.service");
const installment_paid_dto_1 = require("./dto/installment-paid.dto");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, cash_advance_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "cash-advance";
let CashAdvanceController = class CashAdvanceController {
    constructor(cashAdvanceService, cashAdvanceAuthorizationService) {
        this.cashAdvanceService = cashAdvanceService;
        this.cashAdvanceAuthorizationService = cashAdvanceAuthorizationService;
    }
    async create(createDto, files, req) {
        try {
            let data = await this.cashAdvanceService.create(createDto, req.user);
            await this.cashAdvanceService.handleFiles(data.id, files);
            (0, file_management_1.uploadFile)(files);
            let recordData = await this.cashAdvanceService.findOne(data.id);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: recordData };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.cashAdvanceAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [cash_advance_permissions_1.CashAdvancePermissionSet.HR_APPROVAL, cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL]);
            if (!permissions.cashAdvanceFinanceApproval && !permissions.cashAdvanceHRApproval) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.cashAdvanceService.applyFilters(filters, permissions);
            let dt = await this.cashAdvanceService.findAll(appliedFilters, pagination);
            let tCount = this.cashAdvanceService.countRecords(appliedFilters);
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
            let appliedFilters = this.cashAdvanceService.applyFilters(filters);
            let dt = await this.cashAdvanceService.findAll(appliedFilters, pagination);
            let tCount = this.cashAdvanceService.countRecords(appliedFilters);
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
            let permissions = await this.cashAdvanceAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [cash_advance_permissions_1.CashAdvancePermissionSet.HR_APPROVAL, cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL]);
            if (!permissions.cashAdvanceFinanceApproval && !permissions.cashAdvanceHRApproval) {
                await this.cashAdvanceAuthorizationService.isAuthorizedForCashAdvance(params.id, req.user);
            }
            let data = await this.cashAdvanceService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async withdraw(params, req) {
        try {
            await this.cashAdvanceAuthorizationService.isAuthorizedForCashAdvance(params.id, req.user);
            let data = await this.cashAdvanceService.withdraw(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markAsPaid(installmentPaidDto, req) {
        try {
            await this.cashAdvanceAuthorizationService.isAuthorizedForCashAdvance(installmentPaidDto.cashAdvanceId, req.user);
            let data = await this.cashAdvanceService.markAsPaid(installmentPaidDto);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async hrAction(params, CashAdvanceHrAction, req) {
        try {
            let data = await this.cashAdvanceService.hrUpdate(params.id, CashAdvanceHrAction, req.user);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async financeAction(params, action, req) {
        try {
            let data = await this.cashAdvanceService.financeUpdate(params.id, action, req.user);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files[]", 10, multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cash_advance_dto_1.CreateCashAdvanceDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cash_advance_filters_dto_1.CashAdvanceRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('own'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cash_advance_filters_dto_1.CashAdvanceRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "readOwnRequest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('withdraw/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "withdraw", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markAsPaid'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [installment_paid_dto_1.InstallmentPaidDto, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "markAsPaid", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.HR_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `HR Action on cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('hrAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        cash_advance_hr_action_dto_1.CashAdvanceHrAction, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "hrAction", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(cash_advance_permissions_1.CashAdvancePermissionSet.FINANCE_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Action from finance department` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cash_advance_dto_1.CashAdvanceResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('financeAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        cash_advance_finance_action_dto_1.CashAdvanceFinanceAction, Object]),
    __metadata("design:returntype", Promise)
], CashAdvanceController.prototype, "financeAction", null);
CashAdvanceController = __decorate([
    (0, swagger_1.ApiTags)("cash-advance"),
    (0, common_1.Controller)('cash-advance'),
    __metadata("design:paramtypes", [cash_advance_service_1.CashAdvanceService, cash_advance_authorization_service_1.CashAdvanceAuthorizationService])
], CashAdvanceController);
exports.CashAdvanceController = CashAdvanceController;
//# sourceMappingURL=cash-advance.controller.js.map