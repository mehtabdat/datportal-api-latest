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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const payroll_processor_service_1 = require("./payroll.processor.service");
const prisma_service_1 = require("../../../prisma.service");
let PayrollProcessor = class PayrollProcessor {
    constructor(payrollProcessorService, prisma) {
        this.payrollProcessorService = payrollProcessorService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async preparePayrollReport(job) {
        var _a;
        let payrollCycle = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        try {
            if (!payrollCycle) {
                throw { message: "No Payroll cycle provided" };
            }
            await this.payrollProcessorService.preparePayrollReportofAllUser(payrollCycle);
        }
        catch (err) {
            this.logger.error(`Payroll Report Process Error ${payrollCycle === null || payrollCycle === void 0 ? void 0 : payrollCycle.id}`, err.message);
            await this.prisma.payrollCycle.update({
                where: {
                    id: payrollCycle === null || payrollCycle === void 0 ? void 0 : payrollCycle.id,
                    processing: true
                },
                data: {
                    processing: false,
                    failedReport: [err.message]
                }
            });
        }
    }
    async preparePayrollReportOfUser(job) {
        var _a, _b;
        try {
            let payrollCycle = job.data.data.PayrollCycle;
            let userId = job.data.data.userId;
            let salary = job.data.data.salary;
            let salaryId = job.data.data.salaryId;
            let payrollId = job.data.data.payrollId;
            if (!payrollCycle) {
                throw { message: "No Payroll cycle provided" };
            }
            if (!userId) {
                throw { message: "No UserID provided" };
            }
            if (!salary) {
                throw { message: "No Salary Found" };
            }
            let userData = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    Organization: {
                        select: {
                            WorkingHours: true
                        }
                    }
                }
            });
            if (!((_a = userData === null || userData === void 0 ? void 0 : userData.Organization) === null || _a === void 0 ? void 0 : _a.WorkingHours)) {
                throw {
                    message: "No Working Hours Assigned to the Company, Can't process",
                    statusCode: 400
                };
            }
            return await this.payrollProcessorService.preparePayrollReportOfUser(payrollCycle, userId, salary, salaryId, (_b = userData === null || userData === void 0 ? void 0 : userData.Organization) === null || _b === void 0 ? void 0 : _b.WorkingHours, payrollId);
        }
        catch (err) {
            console.error("Payroll Report Process Error", err === null || err === void 0 ? void 0 : err.message);
        }
    }
    globalHandler(job) {
        this.logger.error('No listners were provided, fall back to default', job.data);
    }
};
__decorate([
    (0, bull_1.Process)('preparePayrollReport'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollProcessor.prototype, "preparePayrollReport", null);
__decorate([
    (0, bull_1.Process)('preparePayrollReportOfUser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollProcessor.prototype, "preparePayrollReportOfUser", null);
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollProcessor.prototype, "globalHandler", null);
PayrollProcessor = __decorate([
    (0, bull_1.Processor)('payroll'),
    __metadata("design:paramtypes", [payroll_processor_service_1.PayrollProcessorService, prisma_service_1.PrismaService])
], PayrollProcessor);
exports.PayrollProcessor = PayrollProcessor;
//# sourceMappingURL=payroll.processor.js.map