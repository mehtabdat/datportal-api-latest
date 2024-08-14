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
var PayrollCycleCronJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCycleCronJob = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let PayrollCycleCronJob = PayrollCycleCronJob_1 = class PayrollCycleCronJob {
    constructor(payrollQueue, prisma) {
        this.payrollQueue = payrollQueue;
        this.prisma = prisma;
        this.logger = new common_1.Logger(PayrollCycleCronJob_1.name);
    }
    async preparePayrollReport() {
        this.logger.log("Called every day at 02:00AM to check if paydate has come");
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let payrollCycle = await this.prisma.payrollCycle.findFirst({
            where: {
                processed: false,
                processing: false,
                toDate: {
                    lte: today
                }
            },
            orderBy: {
                fromDate: 'asc'
            }
        });
        if (payrollCycle) {
            let lastPayrollCycle = await this.prisma.payrollCycle.findFirst({
                where: {
                    processed: false,
                    processing: false,
                },
                orderBy: {
                    toDate: 'desc'
                }
            });
            let nextCycleStartDate = new Date(lastPayrollCycle.toDate);
            nextCycleStartDate.setHours(0, 0, 0, 0);
            nextCycleStartDate.setDate(nextCycleStartDate.getDate() + 1);
            let nextCycleEndDate = new Date(lastPayrollCycle.toDate);
            nextCycleEndDate.setHours(23, 59, 59, 999);
            nextCycleEndDate.setDate(nextCycleEndDate.getDate() + 30);
            let doesExist = await this.prisma.payrollCycle.findFirst({
                where: {
                    fromDate: nextCycleStartDate,
                    toDate: nextCycleEndDate,
                }
            });
            if (!doesExist) {
                await this.prisma.payrollCycle.create({
                    data: {
                        fromDate: nextCycleStartDate,
                        toDate: nextCycleEndDate,
                        processed: false
                    }
                });
            }
            await this.prisma.payrollCycle.update({
                where: {
                    id: payrollCycle.id
                },
                data: {
                    processing: true
                }
            });
            this.payrollQueue.add('preparePayrollReport', {
                message: "Start Preparing Payroll Report",
                data: payrollCycle
            }, { removeOnComplete: true });
        }
        else {
            this.logger.log("No payroll found to process");
        }
    }
};
PayrollCycleCronJob = PayrollCycleCronJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('payroll')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], PayrollCycleCronJob);
exports.PayrollCycleCronJob = PayrollCycleCronJob;
//# sourceMappingURL=payroll-cycle.cronjob.js.map