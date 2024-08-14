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
var PayrollCycleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const bull_1 = require("@nestjs/bull");
const common_2 = require("../../helpers/common");
let PayrollCycleService = PayrollCycleService_1 = class PayrollCycleService {
    constructor(prisma, payrollQueue) {
        this.prisma = prisma;
        this.payrollQueue = payrollQueue;
        this.logger = new common_1.Logger(PayrollCycleService_1.name);
    }
    async validateDates(createDto) {
        let today = new Date();
        let fromDate = createDto.fromDate;
        let toDate = createDto.toDate;
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        if (today > createDto.fromDate) {
            let difference = Math.abs((0, common_2.getDifferenceInDays)(fromDate, today));
            if (difference > 60) {
                throw {
                    message: "You cannot add payroll cycle older than 60 days",
                    statusCode: 400
                };
            }
        }
        let conflictingRecords = await this.prisma.payrollCycle.findFirst({
            where: {
                OR: [
                    {
                        AND: [
                            { fromDate: { lte: toDate } },
                            { toDate: { gte: fromDate } },
                        ],
                    },
                    {
                        AND: [
                            { fromDate: { gte: fromDate } },
                            { toDate: { lte: toDate } },
                        ],
                    },
                ],
            }
        });
        if (conflictingRecords) {
            throw {
                message: `There is a overlapping record found. Payroll cycle ID: ${conflictingRecords.id} Start Date: ${(0, common_2.convertDate)(conflictingRecords.fromDate, "dd M yy")} - End Date: ${(0, common_2.convertDate)(conflictingRecords.toDate, "dd M yy")}`,
                statusCode: 400
            };
        }
    }
    create(createDto) {
        let fromDate = createDto.fromDate;
        let toDate = createDto.toDate;
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        return this.prisma.payrollCycle.create({
            data: {
                fromDate: fromDate,
                toDate: toDate,
                processed: false,
                processing: false
            },
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.payrollCycle.findMany({
            where: filters,
            skip: skip,
            take: take,
            orderBy: {
                fromDate: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.payrollCycle.findUnique({
            where: {
                id: id
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    update(id, updateDto) {
        let fromDate = updateDto.fromDate;
        let toDate = updateDto.toDate;
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);
        return this.prisma.payrollCycle.update({
            data: updateDto,
            where: {
                id: id
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    remove(id) {
        return this.prisma.payrollCycle.delete({
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    countRecords(filters) {
        return this.prisma.payrollCycle.count({
            where: filters
        });
    }
    async preparePayrollReportOfProvidedCycle(payrollCycle) {
        await this.prisma.payrollCycle.update({
            where: {
                id: payrollCycle.id
            },
            data: {
                processing: true,
            }
        });
        this.payrollQueue.add('preparePayrollReport', {
            message: "Start Preparing Payroll Report",
            data: payrollCycle
        }, { removeOnComplete: true });
    }
};
PayrollCycleService = PayrollCycleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('payroll')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], PayrollCycleService);
exports.PayrollCycleService = PayrollCycleService;
//# sourceMappingURL=payroll-cycle.service.js.map