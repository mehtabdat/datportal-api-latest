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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const update_payroll_dto_1 = require("./dto/update-payroll.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const payroll_dto_1 = require("./dto/payroll.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const payroll_permissions_1 = require("./payroll.permissions");
const payroll_filters_dto_1 = require("./dto/payroll-filters.dto");
const paid_payroll_dto_1 = require("./dto/paid-payroll.dto");
const payroll_authorization_service_1 = require("./payroll.authorization.service");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const fs = require("fs");
const moduleName = "payroll";
let PayrollController = class PayrollController {
    constructor(payrollService, authorizationService) {
        this.payrollService = payrollService;
        this.authorizationService = authorizationService;
    }
    async findAll(filters, pagination, req) {
        try {
            let permissions = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [payroll_permissions_1.PayrollPermissionSet.READ_ALL]);
            if (!permissions.readAllPayroll) {
                filters.userId = req.user.userId;
            }
            let appliedFilters = this.payrollService.applyFilters(filters);
            let dt = this.payrollService.findAll(appliedFilters, pagination);
            let tCount = this.payrollService.countRecords(appliedFilters);
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
            await this.authorizationService.isAuthorizedForPayroll(params.id, req.user);
            let data = await this.payrollService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, req) {
        try {
            let data = await this.payrollService.update(params.id, updateDto, req.user);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markAsPaid(paidPayrollsDto, req) {
        try {
            let data = await this.payrollService.markAsPaid(paidPayrollsDto, req.user);
            return { message: `Payrolls has been marked as paid successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async recalculate(params) {
        try {
            let data = await this.payrollService.recalculate(params.id);
            return { message: `Recalculating payroll in background`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async remove(params) {
        try {
            let data = await this.payrollService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async generateReport(reportDto, res) {
        try {
            let data = await this.payrollService.generateReport(reportDto);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${data.fileName}`);
            const fileStream = fs.createReadStream(data.filePath);
            fileStream.pipe(res);
            fileStream.on('end', () => {
            });
            return;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_filters_dto_1.PayrollFiltersDto,
        common_types_1.Pagination, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('update/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_payroll_dto_1.UpdatePayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('markAsPaid'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paid_payroll_dto_1.PaidPayrollsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "markAsPaid", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Recalculate ${moduleName} of a user` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject }),
    (0, common_1.Patch)('recalculate/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "recalculate", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "remove", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_permissions_1.PayrollPermissionSet.GENERATE_REPORT),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_dto_1.PayrollResponseObject, isArray: false, description: `Returns the excel file of the payroll report` }),
    (0, common_1.Post)('generateReport'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_report_dto_1.GeneratePayrollReport, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "generateReport", null);
PayrollController = __decorate([
    (0, swagger_1.ApiTags)("payroll"),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService, payroll_authorization_service_1.PayrollAuthorizationService])
], PayrollController);
exports.PayrollController = PayrollController;
//# sourceMappingURL=payroll.controller.js.map