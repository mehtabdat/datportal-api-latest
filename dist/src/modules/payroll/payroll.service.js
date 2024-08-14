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
var PayrollService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const common_2 = require("../../helpers/common");
const bull_1 = require("@nestjs/bull");
const attendance_service_1 = require("../attendance/attendance.service");
const excel_service_1 = require("../file-convertor/excel.service");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const BluebirdPromise = require("bluebird");
const fs_1 = require("fs");
const payroll_processor_service_1 = require("./process/payroll.processor.service");
let PayrollService = PayrollService_1 = class PayrollService {
    constructor(prisma, payrollQueue, attendanceService, payrollProcessorService, excelService) {
        this.prisma = prisma;
        this.payrollQueue = payrollQueue;
        this.attendanceService = attendanceService;
        this.payrollProcessorService = payrollProcessorService;
        this.excelService = excelService;
        this.logger = new common_1.Logger(PayrollService_1.name);
    }
    findAll(filters, pagination) {
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.payroll.findMany({
            where: filters,
            include: {
                User: {
                    select: user_dto_1.UserDefaultAttributes
                },
                ModifiedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                PayrollCycle: {
                    select: {
                        id: true,
                        fromDate: true,
                        toDate: true
                    }
                },
                Deductions: true
            },
            skip: skip,
            take: take,
            orderBy: {
                id: 'desc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.payroll.findUnique({
            where: {
                id: id
            },
            include: {
                User: {
                    select: user_dto_1.UserDefaultAttributes
                },
                ModifiedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                PayrollCycle: {
                    select: {
                        id: true,
                        fromDate: true,
                        toDate: true
                    }
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto, user) {
        let payrollData = await this.prisma.payroll.findUniqueOrThrow({
            where: {
                id: id
            }
        });
        let today = new Date();
        let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(today, payrollData.addedDate));
        if (daysDifference > 31) {
            throw {
                message: "You cannot update a payroll older than 31 days",
                statusCode: 400
            };
        }
        let netReceivable = payrollData.totalReceivable - payrollData.manualCorrection;
        let revisedReceivable = netReceivable + updateDto.manualCorrection;
        return this.prisma.payroll.update({
            data: Object.assign(Object.assign({}, updateDto), { totalReceivable: revisedReceivable, modifiedById: user.userId }),
            where: {
                id: id
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFilters(filters) {
        let condition = {
            isDeleted: false
        };
        if (Object.entries(filters).length > 0) {
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { userId: filters.userId });
            }
            if (filters.payrollCycleId) {
                condition = Object.assign(Object.assign({}, condition), { payrollCycleId: filters.payrollCycleId });
            }
            if (filters.fromDate && filters.toDate) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            monthYear: {
                                gte: new Date(filters.fromDate + "T00:00:00")
                            }
                        },
                        {
                            monthYear: {
                                lte: new Date(filters.toDate + "T23:59:59")
                            }
                        }
                    ] });
            }
            else {
                if (filters.fromDate) {
                    condition = Object.assign(Object.assign({}, condition), { monthYear: { gte: new Date(filters.fromDate + "T00:00:00") } });
                }
                if (filters.toDate) {
                    condition = Object.assign(Object.assign({}, condition), { monthYear: { lte: new Date(filters.toDate + "T23:59:59") } });
                }
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.payroll.count({
            where: filters
        });
    }
    async remove(recordId) {
        let payrollData = await this.prisma.payroll.findUniqueOrThrow({
            where: {
                id: recordId
            },
            include: {
                Deductions: {
                    where: {
                        installmentId: {
                            not: null
                        }
                    }
                }
            }
        });
        let today = new Date();
        let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(today, payrollData.addedDate));
        if (daysDifference > 31) {
            throw {
                message: "You cannot delete a payroll older than 31 days",
                statusCode: 400
            };
        }
        if (payrollData.paid) {
            throw {
                message: "This record has been marked as paid already, you cannot delete this record anymore",
                statuCode: 400
            };
        }
        await this.prisma.payroll.update({
            where: {
                id: recordId
            },
            data: {
                isDeleted: true,
                Deductions: {
                    set: {
                        installmentId: null
                    }
                }
            },
            include: {
                Deductions: {
                    where: {
                        installmentId: {
                            not: null
                        }
                    }
                }
            }
        });
        await this.prisma.payrollDeduction.updateMany({
            where: {
                payrollId: payrollData.id
            },
            data: {
                installmentId: null
            }
        });
        let allInstallmentIds = payrollData.Deductions.map((ele) => ele.installmentId);
        if (allInstallmentIds.length > 0) {
            await this.prisma.cashAdvanceInstallment.updateMany({
                where: {
                    id: {
                        in: allInstallmentIds
                    }
                },
                data: {
                    isPaid: false,
                    paidDate: null
                }
            });
        }
        return payrollData;
    }
    async recalculate(recordId) {
        var _a, _b, _c;
        let payrollData = await this.prisma.payroll.findUniqueOrThrow({
            where: {
                id: recordId
            },
            include: {
                Deductions: {
                    where: {
                        installmentId: {
                            not: null
                        }
                    }
                },
                PayrollCycle: true,
                Salary: true
            }
        });
        let today = new Date();
        let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(today, payrollData.addedDate));
        if (daysDifference > 31) {
            throw {
                message: "You cannot recalculate a payroll older than 31 days",
                statusCode: 400
            };
        }
        if (payrollData.paid) {
            throw {
                message: "This record has been marked as paid already, you cannot recalculate this record anymore",
                statuCode: 400
            };
        }
        await this.prisma.payroll.update({
            where: {
                id: recordId
            },
            data: {
                processing: true
            }
        });
        await this.prisma.payrollDeduction.deleteMany({
            where: {
                payrollId: payrollData.id
            }
        });
        let allInstallmentIds = payrollData.Deductions.map((ele) => ele.installmentId);
        if (allInstallmentIds.length > 0) {
            await this.prisma.cashAdvanceInstallment.updateMany({
                where: {
                    id: {
                        in: allInstallmentIds
                    }
                },
                data: {
                    isPaid: false,
                    paidDate: null
                }
            });
        }
        let userData = await this.prisma.user.findFirst({
            where: {
                id: payrollData.userId
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
        await this.payrollProcessorService.preparePayrollReportOfUser(payrollData.PayrollCycle, payrollData.userId, (_b = payrollData.Salary) === null || _b === void 0 ? void 0 : _b.amount, payrollData.salaryId, (_c = userData === null || userData === void 0 ? void 0 : userData.Organization) === null || _c === void 0 ? void 0 : _c.WorkingHours, payrollData.id);
        return payrollData;
    }
    markAsPaid(paidPayrollsDto, user) {
        let ids = [];
        if (Array.isArray(paidPayrollsDto.ids)) {
            ids = paidPayrollsDto.ids;
        }
        else {
            ids = [paidPayrollsDto.ids];
        }
        return this.prisma.payroll.updateMany({
            where: {
                id: {
                    in: ids
                },
                paid: false
            },
            data: {
                paid: true,
                modifiedById: user.userId,
                paidDate: new Date()
            }
        });
    }
    async generateReport(reportDto) {
        let condition = {};
        if (reportDto.reportType === generate_report_dto_1.PayrollReportType.department) {
            condition = Object.assign(Object.assign({}, condition), { User: {
                    departmentId: reportDto.departmentId
                } });
        }
        else if (reportDto.reportType === generate_report_dto_1.PayrollReportType.organization) {
            condition = Object.assign(Object.assign({}, condition), { User: {
                    organizationId: reportDto.organizationId
                } });
        }
        else if (reportDto.reportType === generate_report_dto_1.PayrollReportType.users) {
            condition = Object.assign(Object.assign({}, condition), { id: {
                    in: reportDto.userIds
                } });
        }
        let payrollCycleData = await this.prisma.payrollCycle.findFirst({
            where: {
                id: reportDto.payrollCycleId
            }
        });
        let payrollData = await this.prisma.payroll.findMany({
            where: Object.assign({ payrollCycleId: reportDto.payrollCycleId }, condition),
            include: {
                User: {
                    select: {
                        id: true,
                        organizationId: true,
                        firstName: true,
                        lastName: true,
                        designation: true,
                        dateOfJoining: true,
                        Department: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                {
                    User: {
                        firstName: 'asc'
                    }
                }
            ]
        });
        let organizationData = await this.prisma.organization.findMany({
            where: {
                isDeleted: false
            },
            include: {
                WorkingHours: true
            }
        });
        let filters = {
            fromDate: payrollCycleData.fromDate,
            toDate: payrollCycleData.toDate,
            userId: null
        };
        let publicHolidayFilters = this.attendanceService.applyFiltersPublicHolidays(filters);
        let publicHolidays = await this.attendanceService.findPublicHolidays(publicHolidayFilters);
        let reportSheets = [];
        const MAX_CONCURRENT_OPERATIONS = 10;
        let reportIndex = 0;
        await BluebirdPromise.map(payrollData, async (payroll) => {
            try {
                filters.userId = payroll.User.id;
                let appliedFilters = this.attendanceService.applyFilters(filters);
                let org = organizationData.find((ele) => ele.id === payroll.User.organizationId);
                if (!(org === null || org === void 0 ? void 0 : org.WorkingHours)) {
                    console.log("I am error");
                    throw {
                        message: "No Working Hours Assigned to the Company" + (org === null || org === void 0 ? void 0 : org.name),
                        statusCode: 400
                    };
                }
                let curIndex = reportIndex++;
                let userAttendance = await this.attendanceService.findAll(appliedFilters, { page: 1, perPage: 32 }, { sortByField: 'checkIn', sortOrder: 'asc' });
                let attendanceData = this.attendanceService.prepareAttendanceFromD1ToD2(userAttendance, publicHolidays, filters, org === null || org === void 0 ? void 0 : org.WorkingHours);
                let userData = Object.assign({}, payroll.User);
                delete payroll.User;
                reportSheets[curIndex] = {
                    sheetName: userData.firstName + " " + userData.lastName,
                    data: {
                        employee: userData,
                        payroll: payroll,
                        attendance: attendanceData
                    }
                };
            }
            catch (err) {
                this.logger.error("Some error while preparing payroll report", err === null || err === void 0 ? void 0 : err.message);
                return true;
            }
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        let attendanceFileName = "Payroll-Report-from-" + (0, common_2.convertDate)(payrollCycleData.fromDate, 'dd-mm-yy') + "-to-" + (0, common_2.convertDate)(payrollCycleData.toDate, 'dd-mm-yy') + ".xlsx";
        let attendanceFilepath = process.cwd() + "/public/payroll/";
        if (!(0, fs_1.existsSync)(attendanceFilepath)) {
            (0, fs_1.mkdirSync)(attendanceFilepath, { recursive: true });
        }
        let filePath = attendanceFilepath + attendanceFileName;
        await this.excelService.PayrollExcelReport(reportSheets, filePath);
        return {
            fileName: attendanceFileName,
            filePath: attendanceFilepath + attendanceFileName
        };
    }
};
PayrollService = PayrollService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('payroll')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, attendance_service_1.AttendanceService,
        payroll_processor_service_1.PayrollProcessorService,
        excel_service_1.ExcelService])
], PayrollService);
exports.PayrollService = PayrollService;
//# sourceMappingURL=payroll.service.js.map