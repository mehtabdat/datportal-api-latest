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
var PayrollProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollProcessorService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../../config/constants");
const common_2 = require("../../../helpers/common");
const prisma_service_1 = require("../../../prisma.service");
const BluebirdPromise = require("bluebird");
let PayrollProcessorService = PayrollProcessorService_1 = class PayrollProcessorService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PayrollProcessorService_1.name);
        this.totalRecords = 0;
        this.failedRecords = 0;
        this.failedReport = [];
    }
    async preparePayrollReportofAllUser(payrollCycle) {
        let allUsers = await this.prisma.user.findMany({
            where: {
                isDeleted: false,
                AND: {
                    OR: [
                        {
                            status: constants_1.UserStatus.active
                        },
                        {
                            status: constants_1.UserStatus.suspended,
                            lastWorkingDate: {
                                gte: payrollCycle.fromDate
                            }
                        }
                    ]
                }
            },
            select: {
                id: true,
                organizationId: true,
                Salary: {
                    where: {
                        OR: [
                            {
                                startDate: {
                                    lte: payrollCycle.fromDate
                                },
                                endDate: {
                                    gte: payrollCycle.toDate
                                }
                            },
                            {
                                startDate: {
                                    lte: payrollCycle.fromDate
                                }
                            }
                        ]
                    },
                    orderBy: [
                        {
                            endDate: 'desc',
                        },
                        {
                            startDate: 'desc'
                        }
                    ],
                    take: 1,
                    select: {
                        id: true,
                        amount: true
                    }
                },
            }
        });
        let allOrganization = await this.prisma.organization.findMany({
            where: {
                isDeleted: false
            },
            include: {
                WorkingHours: true
            }
        });
        this.logger.log(`Found ${allUsers.length} employees to process the payrolls`);
        this.totalRecords = allUsers.length;
        const MAX_CONCURRENT_OPERATIONS = 10;
        await BluebirdPromise.map(allUsers, async (user) => {
            try {
                if (user.Salary && user.Salary.length !== 0) {
                    let organization = allOrganization.find((ele) => ele.id = user.organizationId);
                    await this.preparePayrollReportOfUser(payrollCycle, user.id, user.Salary[0].amount, user.Salary[0].id, organization.WorkingHours);
                }
            }
            catch (err) {
                this.failedReport.push({
                    userId: (err.userId) ? err.userId : null,
                    message: err.message
                });
                this.failedRecords++;
                this.logger.error(`Some error while preparing payroll of userId: ${user.id}`, err.message);
            }
        }, { concurrency: MAX_CONCURRENT_OPERATIONS }).then(async (data) => {
            this.logger.log("Payroll Calculation Completed");
        })
            .catch((err) => {
            this.logger.log("Payroll Calculation Completed with some errors", err.message);
        })
            .finally(async () => {
            await this.prisma.payrollCycle.update({
                where: {
                    id: payrollCycle.id
                },
                data: {
                    processed: true,
                    processing: false,
                    processedDate: new Date(),
                    failedReport: this.failedReport,
                    failed: this.failedRecords,
                    success: this.totalRecords - this.failedRecords
                }
            });
        });
    }
    async preparePayrollReportOfUser(payrollCycle, userId, salary, salaryId, workingHour, payrollId) {
        this.logger.log(`Processing payroll of user - ${userId} for month ${(0, common_2.convertDate)(payrollCycle.fromDate)} and payroll cycle ${payrollCycle.id}`);
        let thisMonthYear = new Date(payrollCycle.fromDate);
        thisMonthYear.setDate(thisMonthYear.getDate() + 14);
        thisMonthYear.setHours(0, 0, 0, 0);
        let totalAbsences = 0;
        let totalIncompletes = 0;
        let totalLates = 0;
        let totalReceivable = 0;
        let totalDeduction = 0;
        let totalDaysWorked = 0;
        let toBeDeductedFromCurrentSalary = 0;
        let toBeDeductedFromLeaveCredits = 0;
        let overusedLeaveCredits = 0;
        let allDeductions = [];
        let availableLeaveCredits = 0;
        let manualCorrection = 0;
        let totaDaysInCycle = Math.abs((0, common_2.getDifferenceInDays)(payrollCycle.fromDate, payrollCycle.toDate)) + 1;
        let totalWorkingDaysInCycle = 0;
        let allHours = workingHour.hours;
        let hasExistingPayroll = await this.prisma.payroll.findFirst({
            where: {
                userId: userId,
                payrollCycleId: payrollCycle.id,
                isDeleted: false
            }
        });
        if (hasExistingPayroll && hasExistingPayroll.id !== payrollId) {
            throw {
                message: `UserId: ${userId}, This month payroll was already created for this user, instead please delete and recreate`,
                userId: userId
            };
        }
        if (hasExistingPayroll) {
            manualCorrection = hasExistingPayroll.manualCorrection;
        }
        let publicHoliday = await this.prisma.publicHoliday.findMany({
            where: {
                date: {
                    gte: payrollCycle.fromDate,
                    lte: payrollCycle.toDate
                }
            }
        });
        let leaveRequest = await this.prisma.leaveRequest.findMany({
            where: {
                requestById: userId,
                status: constants_1.LeaveRequestStatus.approved,
                leaveFrom: {
                    gte: payrollCycle.fromDate,
                    lte: payrollCycle.toDate
                }
            }
        });
        let leaveCreditsData = await this.prisma.leaveCredits.aggregate({ where: { isDeleted: false, userId: userId }, _sum: { daysCount: true } });
        let leaveCredits = leaveCreditsData._sum.daysCount;
        let usedLeavesData = await this.prisma.payroll.aggregate({ where: { userId: userId }, _sum: { toBeDeductedFromLeaveCredits: true } });
        let usedLeaves = usedLeavesData._sum.toBeDeductedFromLeaveCredits;
        availableLeaveCredits = leaveCredits - usedLeaves;
        await this.prisma.cashAdvanceRequest.findMany({
            where: {
                requestById: userId,
                status: constants_1.CashAdvanceRequestStatus.paid_and_closed,
                Installments: {
                    some: {
                        monthYear: new Date(thisMonthYear.getFullYear(), thisMonthYear.getMonth(), 1),
                        isPaid: false
                    }
                }
            },
            include: {
                Installments: {
                    where: {
                        monthYear: new Date(thisMonthYear.getFullYear(), thisMonthYear.getMonth(), 1),
                        isPaid: false
                    }
                }
            }
        }).then(cashAdvance => {
            cashAdvance.forEach(async (ele) => {
                let toBeDeducted = ele.installmentAmount;
                let deductionData = {
                    title: `Installment of cash Advance of ${ele.approvedAmount}`,
                    amount: toBeDeducted,
                    installmentId: ele.Installments[0].id
                };
                allDeductions.push(deductionData);
                await this.prisma.cashAdvanceInstallment.update({
                    where: {
                        id: ele.Installments[0].id
                    },
                    data: {
                        isPaid: true,
                        paidDate: new Date()
                    }
                });
            });
        }).catch(err => {
            this.logger.error("Error while fetching Cash Advance Data", err.message);
        });
        let toDate = new Date(payrollCycle.toDate);
        toDate.setHours(23, 59, 59, 999);
        let attendanceData = await this.prisma.attendance.findMany({
            where: {
                userId: userId,
                checkIn: {
                    gte: payrollCycle.fromDate,
                    lte: toDate
                }
            }
        });
        let endDate = new Date(payrollCycle.toDate);
        endDate.setHours(0, 0, 0, 0);
        let processingDate = new Date(payrollCycle.fromDate);
        processingDate.setDate(processingDate.getDate() - 1);
        processingDate.setHours(0, 0, 0, 0);
        let iterationCount = 0;
        while (processingDate < endDate) {
            if (iterationCount > 40) {
                break;
            }
            iterationCount++;
            processingDate.setDate(processingDate.getDate() + 1);
            let holidayData = publicHoliday.find((ele) => (0, common_2.isSameDay)(processingDate, ele.date));
            let dayWorkingHour = allHours.find((ele) => ele.day === processingDate.getDay());
            let _isWeekend = dayWorkingHour.closed;
            if (_isWeekend) {
                let leaveData = leaveRequest.find((ele) => (0, common_2.isDateInRange)(processingDate, ele.leaveFrom, ele.leaveTo));
                if (leaveData) {
                    totalAbsences++;
                    continue;
                }
                if (holidayData) {
                    continue;
                }
                let isPaidWeekend = await this.findIfWeekendIsPaid(userId, processingDate);
                if (!isPaidWeekend) {
                    totalAbsences++;
                    continue;
                }
            }
            if (holidayData) {
                let leaveData = leaveRequest.find((ele) => (0, common_2.isDateInRange)(processingDate, ele.leaveFrom, ele.leaveTo));
                if (leaveData) {
                    totalAbsences++;
                    continue;
                }
                let isPaidHoliday = await this.findIfHolidayIsPaid(userId, processingDate);
                if (!isPaidHoliday) {
                    totalAbsences++;
                    continue;
                }
                continue;
            }
            ;
            if (_isWeekend) {
                continue;
            }
            ;
            let dayRecord = attendanceData.find((ele) => (0, common_2.isSameDay)(processingDate, ele.checkIn));
            if (dayRecord && dayRecord.staus === constants_1.AttendanceStatus.off) {
                continue;
            }
            totalWorkingDaysInCycle++;
            if (!dayRecord || (dayRecord === null || dayRecord === void 0 ? void 0 : dayRecord.staus) === constants_1.AttendanceStatus.absent) {
                let leaveData = leaveRequest.find((ele) => (0, common_2.isDateInRange)(processingDate, ele.leaveFrom, ele.leaveTo));
                if (leaveData && leaveData.isPaid) {
                    if (availableLeaveCredits >= toBeDeductedFromLeaveCredits) {
                        toBeDeductedFromLeaveCredits = toBeDeductedFromLeaveCredits + 1;
                    }
                    else {
                        overusedLeaveCredits++;
                    }
                    totalAbsences = totalAbsences + 1;
                    continue;
                }
                else {
                    totalAbsences = totalAbsences + 1;
                    continue;
                }
            }
            totalDaysWorked++;
        }
        toBeDeductedFromCurrentSalary = totalAbsences - toBeDeductedFromLeaveCredits;
        if (toBeDeductedFromCurrentSalary > 0) {
            let title = `Deduction of ${toBeDeductedFromCurrentSalary} absenses in this month. `;
            if (toBeDeductedFromLeaveCredits) {
                title += `${toBeDeductedFromLeaveCredits} leave(s) deducted from leave credits. `;
            }
            if (overusedLeaveCredits) {
                title += `${overusedLeaveCredits} leaves are being deducted from current salary as leaves threshold has meet`;
            }
            let amountToBeDeductedFromCurrentSalary = (salary / totaDaysInCycle) * toBeDeductedFromCurrentSalary;
            let deductionData = {
                title: title,
                amount: amountToBeDeductedFromCurrentSalary
            };
            allDeductions.push(deductionData);
        }
        await this.prisma.attendance.aggregate({
            where: {
                userId: userId,
                staus: constants_1.AttendanceStatus.incomplete,
                proRatedDeduction: {
                    gte: 0
                },
                checkIn: {
                    gte: payrollCycle.fromDate,
                    lte: payrollCycle.toDate
                }
            },
            _sum: {
                proRatedDeduction: true
            },
            _count: {
                id: true
            }
        }).then(data => {
            if (data._count.id > 0) {
                totalIncompletes = data._sum.proRatedDeduction;
                let totalIncompleteDays = data._count.id;
                let toBeDeducted = (salary / totaDaysInCycle) * totalIncompletes;
                if (toBeDeducted > 0) {
                    let deductionData = {
                        title: `Deduction of ${totalIncompleteDays} day(s) incomplete working hours`,
                        amount: toBeDeducted
                    };
                    toBeDeductedFromCurrentSalary += totalIncompletes;
                    allDeductions.push(deductionData);
                }
            }
        });
        await this.prisma.attendance.aggregate({
            where: {
                userId: userId,
                staus: constants_1.AttendanceStatus.late,
                checkIn: {
                    gte: payrollCycle.fromDate,
                    lte: payrollCycle.toDate
                }
            },
            _count: {
                id: true
            }
        }).then(data => {
            totalLates = data._count.id;
            let deductionDaysCount = Math.floor(totalLates / 3);
            if (deductionDaysCount >= 1) {
                let toBeDeducted = deductionDaysCount * ((salary / totaDaysInCycle) / 2);
                let deductionData = {
                    title: `Deduction of ${totalLates} day(s) lates`,
                    amount: toBeDeducted
                };
                toBeDeductedFromCurrentSalary += deductionDaysCount / 2;
                allDeductions.push(deductionData);
            }
        });
        allDeductions.forEach((ele) => {
            totalDeduction += ele.amount;
        });
        totalReceivable = salary - totalDeduction + manualCorrection;
        let payrollData = {
            monthYear: thisMonthYear,
            userId: userId,
            salaryAmount: salary,
            salaryId: salaryId,
            totalDeduction: totalDeduction,
            totalLates: totalLates,
            totalAbsences: totalAbsences,
            totalIncompletes: totalIncompletes,
            totalReceivable: totalReceivable,
            totalDays: totaDaysInCycle,
            totalWorkingDays: totalWorkingDaysInCycle,
            totalDaysWorked: totalDaysWorked,
            toBeDeductedFromCurrentSalary: toBeDeductedFromCurrentSalary,
            toBeDeductedFromLeaveCredits: toBeDeductedFromLeaveCredits,
            payrollCycleId: payrollCycle.id,
            manualCorrection: manualCorrection,
            processing: false,
            isDeleted: false,
            paid: false
        };
        if (payrollId) {
            return this.prisma.payroll.update({
                where: {
                    id: payrollId
                },
                data: payrollData
            }).then(async (data) => {
                this.logger.log(`Payroll updated for user ${userId}`);
                return await this.prisma.payrollDeduction.createMany({
                    data: allDeductions.map((ele) => { return Object.assign(Object.assign({}, ele), { payrollId: data.id }); })
                });
            }).catch((err) => {
                this.logger.error(`Error while updating payroll ID: ${payrollId}, UserId: ${userId}`, err.message);
            });
        }
        else {
            return this.prisma.payroll.create({
                data: payrollData
            }).then(async (data) => {
                this.logger.log(`Payroll created for user ${userId}`);
                return await this.prisma.payrollDeduction.createMany({
                    data: allDeductions.map((ele) => { return Object.assign(Object.assign({}, ele), { payrollId: data.id }); })
                });
            }).catch((err) => {
                this.logger.error(`Error while creating payroll, UserId: ${userId}`, err.message);
            });
        }
    }
    async findIfWeekendIsPaid(userId, processingDate) {
        let prevWeek = new Date(processingDate);
        prevWeek.setDate(prevWeek.getDate() - 6);
        let userAttendance = await this.prisma.attendance.findMany({
            where: {
                userId: userId,
                staus: {
                    notIn: [constants_1.AttendanceStatus.absent, constants_1.AttendanceStatus.off]
                },
                checkIn: {
                    gte: prevWeek,
                    lte: processingDate
                }
            }
        });
        if (userAttendance.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    async findIfHolidayIsPaid(userId, processingDate) {
        let prevWeek = new Date(processingDate);
        prevWeek.setDate(prevWeek.getDate() - 6);
        let userAttendance = await this.prisma.attendance.findMany({
            where: {
                userId: userId,
                staus: {
                    notIn: [constants_1.AttendanceStatus.absent, constants_1.AttendanceStatus.off]
                },
                checkIn: {
                    gte: prevWeek,
                    lte: processingDate
                }
            }
        });
        if (userAttendance.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
};
PayrollProcessorService = PayrollProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollProcessorService);
exports.PayrollProcessorService = PayrollProcessorService;
//# sourceMappingURL=payroll.processor.service.js.map