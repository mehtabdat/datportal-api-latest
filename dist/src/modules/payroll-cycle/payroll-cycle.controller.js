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
exports.PayrollCycleController = void 0;
const common_1 = require("@nestjs/common");
const payroll_cycle_service_1 = require("./payroll-cycle.service");
const create_payroll_cycle_dto_1 = require("./dto/create-payroll-cycle.dto");
const update_payroll_cycle_dto_1 = require("./dto/update-payroll-cycle.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const payroll_cycle_dto_1 = require("./dto/payroll-cycle.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const payroll_cycle_permissions_1 = require("./payroll-cycle.permissions");
const moduleName = "payroll-cycle";
let PayrollCycleController = class PayrollCycleController {
    constructor(payrollCycleService) {
        this.payrollCycleService = payrollCycleService;
    }
    async create(createDto) {
        try {
            await this.payrollCycleService.validateDates(createDto);
            let data = await this.payrollCycleService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(pagination) {
        try {
            let dt = this.payrollCycleService.findAll({}, pagination);
            let tCount = this.payrollCycleService.countRecords({});
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
            let data = await this.payrollCycleService.findOne(params.id);
            if (!data) {
                throw {
                    message: "No Payroll Cycle record found",
                    statusCode: 404
                };
            }
            if (data.processed) {
                throw {
                    message: "This cycle is already processed. You cannot re process the same",
                    statusCode: 400
                };
            }
            if (data.processing) {
                throw {
                    message: "This cycle is under processing. Please wait till it is completed",
                    statusCode: 400
                };
            }
            let today = new Date();
            today.setDate(today.getDate() + 1);
            if (data.toDate > today) {
                throw {
                    message: "Please wait until the payroll cycle is completed. The system has identified that the pay date for this cycle has not yet occurred.",
                    statusCode: 400
                };
            }
            this.payrollCycleService.preparePayrollReportOfProvidedCycle(data);
            return { message: `Process started on background to calculate payroll for the given cycle`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.payrollCycleService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let dt = await this.payrollCycleService.findOne(params.id);
            if (dt.processed || dt.processing) {
                throw {
                    message: "You cannot delete a record which is already processed or processing",
                    statusCode: 400
                };
            }
            let data = await this.payrollCycleService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_cycle_permissions_1.PayrollCyclePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_cycle_dto_1.PayrollCycleResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_cycle_dto_1.CreatePayrollCycleDto]),
    __metadata("design:returntype", Promise)
], PayrollCycleController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_cycle_permissions_1.PayrollCyclePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_cycle_dto_1.PayrollCycleResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], PayrollCycleController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_cycle_permissions_1.PayrollCyclePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_cycle_dto_1.PayrollCycleResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('process/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PayrollCycleController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_cycle_permissions_1.PayrollCyclePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_cycle_dto_1.PayrollCycleResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_payroll_cycle_dto_1.UpdatePayrollCycleDto]),
    __metadata("design:returntype", Promise)
], PayrollCycleController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(payroll_cycle_permissions_1.PayrollCyclePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: payroll_cycle_dto_1.PayrollCycleResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], PayrollCycleController.prototype, "remove", null);
PayrollCycleController = __decorate([
    (0, swagger_1.ApiTags)("payroll-cycle"),
    (0, common_1.Controller)('payroll-cycle'),
    __metadata("design:paramtypes", [payroll_cycle_service_1.PayrollCycleService])
], PayrollCycleController);
exports.PayrollCycleController = PayrollCycleController;
//# sourceMappingURL=payroll-cycle.controller.js.map