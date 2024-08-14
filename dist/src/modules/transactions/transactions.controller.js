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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const transactions_dto_1 = require("./dto/transactions.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const transactions_permissions_1 = require("./transactions.permissions");
const transaction_filters_dto_1 = require("./dto/transaction-filters.dto");
const transaction_pagination_dto_1 = require("./dto/transaction-pagination.dto");
const transaction_sorting_dto_1 = require("./dto/transaction-sorting.dto");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const file_management_1 = require("../../helpers/file-management");
const assign_transaction_dto_1 = require("./dto/assign-transaction.dto");
const system_logger_service_1 = require("../system-logs/system-logger.service");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, transactions_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "transactions";
let TransactionsController = class TransactionsController {
    constructor(transactionsService, systemLogger) {
        this.transactionsService = transactionsService;
        this.systemLogger = systemLogger;
    }
    async create(createTransactionDto, receipt, req) {
        try {
            if (receipt) {
                createTransactionDto.receipt = (0, file_upload_utils_1.extractRelativePathFromFullPath)(receipt.path);
            }
            let data = await this.transactionsService.create(createTransactionDto, req.user);
            await (0, file_management_1.uploadFile)(receipt);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(receipt);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(req, filters, pagination, sorting) {
        try {
            let filtersApplied = this.transactionsService.applyFilters(filters);
            let dt = this.transactionsService.findAll(pagination, sorting, filtersApplied);
            let tCount = this.transactionsService.countTotalRecord(filtersApplied);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return {
                message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
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
            let data = await this.transactionsService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async assignTransaction(params, assignTransactionDto, req) {
        try {
            let data = await this.transactionsService.assignTransaction(params.id, assignTransactionDto, req.user);
            this.systemLogger.logData({
                tableName: "Transactions",
                field: 'id',
                value: params.id,
                actionType: 'ASSIGN_TRANSACTION',
                valueType: "number",
                user: req.user.userId,
                data: assignTransactionDto,
                endPoint: req.originalUrl,
                controllerName: this.constructor.name,
                message: "Transaction Assigned"
            });
            return { data: data, statusCode: 200, message: "Transaction Assigned Successfully" };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, receipt, updateTransactionDto) {
        try {
            if (receipt) {
                updateTransactionDto.receipt = (0, file_upload_utils_1.extractRelativePathFromFullPath)(receipt.path);
            }
            let data = await this.transactionsService.update(params.id, updateTransactionDto);
            await (0, file_management_1.uploadFile)(receipt);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(receipt);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.transactionsService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receipt', multerOptionsProtected)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transaction_filters_dto_1.TransactionFiltersDto,
        transaction_pagination_dto_1.TransactionPaginationDto,
        transaction_sorting_dto_1.TransactionSortingDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Assign Transaction to a User` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseObject, isArray: false, description: `Assign Transaction to a User` }),
    (0, common_1.Patch)('assignTransaction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        assign_transaction_dto_1.AssignTransactionDto, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "assignTransaction", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receipt', multerOptionsProtected)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(transactions_permissions_1.TransactionPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: transactions_dto_1.TransactionResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "remove", null);
TransactionsController = __decorate([
    (0, swagger_1.ApiTags)("transactions"),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService, system_logger_service_1.SystemLogger])
], TransactionsController);
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map