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
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const user_dto_1 = require("../user/dto/user.dto");
const constants_1 = require("../../config/constants");
const common_2 = require("../../helpers/common");
const bull_1 = require("@nestjs/bull");
const generate_report_dto_1 = require("./dto/generate-report.dto");
const BluebirdPromise = require("bluebird");
const excel_service_1 = require("../file-convertor/excel.service");
const fs_1 = require("fs");
let AttendanceService = AttendanceService_1 = class AttendanceService {
    constructor(prisma, attendanceQueue, excelService) {
        this.prisma = prisma;
        this.attendanceQueue = attendanceQueue;
        this.excelService = excelService;
        this.logger = new common_1.Logger(AttendanceService_1.name);
    }
    checkAttendanceStatus(date, hours, workingHour) {
        var dayOfWeek = date.getDay();
        let allHours = workingHour.hours;
        let dayWorkingHour = allHours.find((ele) => ele.day === dayOfWeek);
        if (dayWorkingHour.closed) {
            return constants_1.AttendanceStatus.off;
        }
        if (hours === 0) {
            return constants_1.AttendanceStatus.absent;
        }
        if (hours >= dayWorkingHour.totalHours - constants_1.OrganizationPolicy.attendanceGraceTime) {
            return constants_1.AttendanceStatus.complete;
        }
        if (hours >= dayWorkingHour.totalHours - constants_1.OrganizationPolicy.lateGraceTime) {
            return constants_1.AttendanceStatus.late;
        }
        return constants_1.AttendanceStatus.incomplete;
    }
    calculateIncompleteDeduction(status, date, hours, workingHour) {
        var dayOfWeek = date.getDay();
        let allHours = workingHour.hours;
        let dayWorkingHour = allHours.find((ele) => ele.day === dayOfWeek);
        if (status === constants_1.AttendanceStatus.incomplete) {
            if (dayWorkingHour.closed) {
                return 0;
            }
            return Number((1 - (hours / dayWorkingHour.totalHours)).toFixed(6));
        }
        return 0;
    }
    async create(createDto, user) {
        let checkInDayStart = new Date(createDto.checkIn);
        checkInDayStart.setHours(0, 0, 0, 0);
        let checkOutDayEnd = new Date(createDto.checkOut);
        checkOutDayEnd.setHours(23, 59, 59, 999);
        let existingRecord = await this.prisma.attendance.findFirst({
            where: {
                userId: createDto.userId,
                AND: [
                    {
                        checkIn: {
                            gte: checkInDayStart
                        }
                    },
                    {
                        checkIn: {
                            lte: checkOutDayEnd
                        }
                    }
                ]
            }
        });
        if (existingRecord) {
            throw {
                message: "Attendance for the given user in this date already exists",
                statusCode: 400
            };
        }
        let areSameDate = (0, common_2.isSameDay)(createDto.checkIn, createDto.checkOut);
        if (!areSameDate) {
            throw {
                message: "Check In and and Check Out Date must be same",
                statusCode: 400
            };
        }
        let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(new Date(), createDto.checkIn));
        if (daysDifference > 60) {
            throw {
                message: "You cannot add attendance data older than 31 days",
                statusCode: 404
            };
        }
        if (createDto.checkIn > new Date()) {
            throw {
                message: "You cannot add attendance data for future dates",
                statusCode: 404
            };
        }
        let userData = await this.prisma.user.findFirst({
            where: {
                id: createDto.userId
            }
        });
        let organization = await this.prisma.organization.findFirst({
            where: {
                id: userData.organizationId
            },
            include: {
                WorkingHours: true
            }
        });
        if (!organization.WorkingHours) {
            throw {
                message: "No Working Hours Defined for the Company. Please assign working hour and try again",
                statusCode: 400
            };
        }
        let hoursWorked = Math.abs((0, common_2.calculateTotalHours)(createDto.checkIn, createDto.checkOut));
        let status = this.checkAttendanceStatus(createDto.checkIn, hoursWorked, organization.WorkingHours);
        let proRatedDeduction = this.calculateIncompleteDeduction(status, createDto.checkIn, hoursWorked, organization.WorkingHours);
        return this.prisma.attendance.create({
            data: Object.assign(Object.assign({}, createDto), { totalHours: hoursWorked, staus: status, proRatedDeduction: proRatedDeduction, type: constants_1.AttendanceEntryType.manual, addedById: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : user.userId, addedDate: new Date() }),
        })
            .catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    findAll(filters, pagination, sorting) {
        let __sorter = { [sorting.sortByField]: sorting.sortOrder };
        let skip = (pagination.perPage * (pagination.page - 1));
        let take = pagination.perPage;
        let records = this.prisma.attendance.findMany({
            where: filters,
            skip: skip,
            take: take,
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                ModifiedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                User: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
            orderBy: __sorter
        });
        return records;
    }
    findPublicHolidays(filters) {
        let records = this.prisma.publicHoliday.findMany({
            where: filters,
            orderBy: {
                date: 'asc'
            }
        });
        return records;
    }
    findApprovedLeaveRequest(filters) {
        let records = this.prisma.leaveRequest.findMany({
            where: filters,
            orderBy: {
                leaveFrom: 'asc'
            }
        });
        return records;
    }
    findOne(id) {
        return this.prisma.attendance.findUnique({
            where: {
                id: id
            },
            include: {
                AddedBy: {
                    select: user_dto_1.UserDefaultAttributes
                },
                User: {
                    select: user_dto_1.UserDefaultAttributes
                }
            },
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    async update(id, updateDto, user) {
        let hoursWorked = undefined;
        let status = undefined;
        let proRatedDeduction = undefined;
        let recordData = await this.prisma.attendance.findUniqueOrThrow({ where: {
                id: id
            } });
        if (!recordData) {
            throw {
                message: "Record doesnot exist",
                statusCode: 404
            };
        }
        if ((updateDto.checkIn && !updateDto.checkOut) || (updateDto.checkOut && !updateDto.checkIn)) {
            throw {
                message: "Please provide both check in and check out time or provide none",
                statusCode: 400
            };
        }
        let userData = await this.prisma.user.findFirst({
            where: {
                id: recordData.userId
            }
        });
        let organization = await this.prisma.organization.findFirst({
            where: {
                id: userData.organizationId
            },
            include: {
                WorkingHours: true
            }
        });
        if (!organization.WorkingHours) {
            throw {
                message: "No Working Hours Defined for the Company. Please assign working hour and try again",
                statusCode: 400
            };
        }
        if (updateDto.checkIn && updateDto.checkOut) {
            hoursWorked = Math.abs((0, common_2.calculateTotalHours)(updateDto.checkIn, updateDto.checkOut));
            status = this.checkAttendanceStatus(updateDto.checkIn, hoursWorked, organization.WorkingHours);
            proRatedDeduction = this.calculateIncompleteDeduction(status, updateDto.checkIn, hoursWorked, organization.WorkingHours);
            let checkInDayStart = new Date(updateDto.checkIn);
            checkInDayStart.setHours(0, 0, 0, 0);
            let checkOutDayEnd = new Date(updateDto.checkOut);
            checkOutDayEnd.setHours(23, 59, 59, 999);
            let existingRecord = await this.prisma.attendance.findFirst({
                where: {
                    userId: recordData.userId,
                    id: { not: id },
                    AND: [
                        { checkIn: { gte: checkInDayStart } },
                        { checkIn: { lte: checkOutDayEnd } }
                    ]
                }
            });
            if (existingRecord) {
                throw {
                    message: "Attendance for the given user in this date already exists",
                    statusCode: 400
                };
            }
            let areSameDate = (0, common_2.isSameDay)(updateDto.checkIn, updateDto.checkOut);
            if (!areSameDate) {
                throw {
                    message: "Check In and and Check Out Date must be same",
                    statusCode: 400
                };
            }
            let daysDifference = Math.abs((0, common_2.getDifferenceInDays)(new Date(), updateDto.checkIn));
            if (daysDifference > 60) {
                throw {
                    message: "You cannot update attendance data older than 31 days",
                    statusCode: 404
                };
            }
            if (updateDto.checkIn > new Date()) {
                throw {
                    message: "You cannot update attendance data for future dates",
                    statusCode: 404
                };
            }
        }
        return this.prisma.attendance.update({
            data: Object.assign(Object.assign({}, updateDto), { totalHours: hoursWorked, staus: status, proRatedDeduction: proRatedDeduction, modifiedById: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : user.userId, modifiedDate: (user.userEmail === constants_1.TEST_EMAIL) ? undefined : new Date() }),
            where: {
                id: id
            }
        }).catch((err) => {
            this.logger.error("Error on " + this.constructor.name + " \n Error code : " + err.code + " \n Error message : " + err.message);
            let errorResponse = { message: err.message, statusCode: 400, data: {} };
            throw errorResponse;
        });
    }
    applyFiltersPublicHolidays(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if ("month" in filters && "year" in filters && filters.month && filters.year) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            date: {
                                gte: new Date(filters.year, filters.month, 1),
                            }
                        },
                        {
                            date: {
                                lt: new Date(filters.year, filters.month + 1, 1),
                            }
                        }
                    ] });
            }
            if ("fromDate" in filters && filters.fromDate && filters.toDate) {
                let fromDate = new Date(filters.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                let toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 99);
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            date: {
                                gte: fromDate
                            }
                        },
                        {
                            date: {
                                lte: toDate
                            }
                        }
                    ] });
            }
            else {
                if ("fromDate" in filters && filters.fromDate) {
                    let fromDate = new Date(filters.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    condition = Object.assign(Object.assign({}, condition), { date: { gte: fromDate } });
                }
                if ("toDate" in filters && filters.toDate) {
                    let toDate = new Date(filters.toDate);
                    toDate.setHours(23, 59, 59, 99);
                    condition = Object.assign(Object.assign({}, condition), { date: { lte: toDate } });
                }
            }
        }
        return condition;
    }
    leaveRequestFilters(filters) {
        let condition = {
            status: constants_1.LeaveRequestStatus.approved
        };
        if (Object.entries(filters).length > 0) {
            if ("month" in filters && "year" in filters && filters.month && filters.year) {
                if (filters.userId) {
                    condition = Object.assign(Object.assign({}, condition), { requestById: filters.userId });
                }
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            leaveFrom: {
                                gte: new Date(filters.year, filters.month, 1),
                            }
                        },
                        {
                            leaveFrom: {
                                lt: new Date(filters.year, filters.month + 1, 1),
                            }
                        }
                    ] });
            }
            if ("fromDate" in filters && filters.fromDate && filters.toDate) {
                let fromDate = new Date(filters.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                let toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 99);
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            leaveFrom: {
                                gte: fromDate
                            }
                        },
                        {
                            leaveFrom: {
                                lte: toDate
                            }
                        }
                    ] });
            }
            else {
                if ("fromDate" in filters && filters.fromDate) {
                    let fromDate = new Date(filters.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    condition = Object.assign(Object.assign({}, condition), { leaveFrom: { gte: fromDate } });
                }
                if ("toDate" in filters && filters.toDate) {
                    let toDate = new Date(filters.toDate);
                    toDate.setHours(23, 59, 59, 99);
                    condition = Object.assign(Object.assign({}, condition), { leaveFrom: { lte: toDate } });
                }
            }
        }
        return condition;
    }
    applyFilters(filters) {
        let condition = {};
        if (Object.entries(filters).length > 0) {
            if (filters.type) {
                condition = Object.assign(Object.assign({}, condition), { type: filters.type });
            }
            if (filters.userId) {
                condition = Object.assign(Object.assign({}, condition), { userId: filters.userId });
            }
            if ("fromDate" in filters && filters.fromDate && filters.toDate) {
                let fromDate = new Date(filters.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                let toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 99);
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            checkIn: {
                                gte: fromDate
                            }
                        },
                        {
                            checkIn: {
                                lte: toDate
                            }
                        }
                    ] });
            }
            else {
                if ("fromDate" in filters && filters.fromDate) {
                    let fromDate = new Date(filters.fromDate);
                    fromDate.setHours(0, 0, 0, 0);
                    condition = Object.assign(Object.assign({}, condition), { checkIn: { gte: fromDate } });
                }
                if ("toDate" in filters && filters.toDate) {
                    let toDate = new Date(filters.toDate);
                    toDate.setHours(23, 59, 59, 99);
                    condition = Object.assign(Object.assign({}, condition), { checkIn: { lte: toDate } });
                }
            }
            if ("month" in filters && (filters.month || filters.month === 0) && "year" in filters && filters.year) {
                condition = Object.assign(Object.assign({}, condition), { AND: [
                        {
                            checkIn: {
                                gte: new Date(filters.year, filters.month, 1),
                            }
                        },
                        {
                            checkIn: {
                                lt: new Date(filters.year, filters.month + 1, 1),
                            }
                        }
                    ] });
            }
        }
        return condition;
    }
    countRecords(filters) {
        return this.prisma.attendance.count({
            where: filters
        });
    }
    prepareAttendance(attendance, publicHolidays, filters, workingHour) {
        let userAttendance = [];
        const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
        let allHours = workingHour.hours;
        for (let day = 1; day <= daysInMonth; day++) {
            let status = constants_1.AttendanceStatus.absent;
            const currentDate = new Date(filters.year, filters.month, day);
            const attendanceData = attendance.find(record => (0, common_2.isSameDay)(currentDate, record.checkIn));
            if (attendanceData) {
                status = attendanceData.staus;
            }
            let dayWorkingHour = allHours.find((ele) => ele.day === currentDate.getDay());
            const isWeekendDay = dayWorkingHour.closed;
            if (isWeekendDay)
                status = constants_1.AttendanceStatus.off;
            const isPublicHoliday = publicHolidays.find(holiday => (0, common_2.isSameDay)(currentDate, holiday.date));
            if (isPublicHoliday)
                status = constants_1.AttendanceStatus.off;
            userAttendance.push({
                recordId: attendanceData ? attendanceData.id : null,
                userId: filters.userId,
                entryType: attendanceData ? attendanceData.type : undefined,
                day: currentDate,
                status: status,
                checkIn: attendanceData ? attendanceData.checkIn : undefined,
                checkOut: attendanceData ? attendanceData.checkOut : undefined,
                note: attendanceData ? attendanceData.note : "",
                hoursWorked: attendanceData ? attendanceData.totalHours : 0,
                proRatedDeduction: attendanceData ? attendanceData.proRatedDeduction : 0,
                AddedBy: attendanceData && attendanceData.AddedBy ? attendanceData.AddedBy : null,
                ModifiedBy: attendanceData && attendanceData.ModifiedBy ? attendanceData.ModifiedBy : null,
                modifiedDate: (attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.modifiedDate) ? attendanceData.modifiedDate : undefined,
                totalHours: attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.totalHours
            });
        }
        return userAttendance;
    }
    prepareAttendanceFromD1ToD2(attendance, publicHolidays, filters, workingHour) {
        let userAttendance = [];
        let allHours = workingHour.hours;
        let startDate = new Date(filters.fromDate);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(filters.toDate);
        endDate.setHours(23, 59, 59, 99);
        for (let cDate = startDate; cDate <= endDate; cDate.setDate(cDate.getDate() + 1)) {
            let status = constants_1.AttendanceStatus.absent;
            const currentDate = new Date(cDate);
            const attendanceData = attendance.find(record => (0, common_2.isSameDay)(currentDate, record.checkIn));
            if (attendanceData) {
                status = attendanceData.staus;
            }
            let dayWorkingHour = allHours.find((ele) => ele.day === currentDate.getDay());
            const isWeekendDay = dayWorkingHour.closed;
            if (isWeekendDay)
                status = constants_1.AttendanceStatus.off;
            const isPublicHoliday = publicHolidays.find(holiday => (0, common_2.isSameDay)(currentDate, holiday.date));
            if (isPublicHoliday)
                status = constants_1.AttendanceStatus.off;
            userAttendance.push({
                recordId: attendanceData ? attendanceData.id : null,
                userId: filters.userId,
                entryType: attendanceData ? attendanceData.type : undefined,
                day: currentDate,
                checkIn: attendanceData ? attendanceData.checkIn : undefined,
                checkOut: attendanceData ? attendanceData.checkOut : undefined,
                status: status,
                note: attendanceData ? attendanceData.note : "",
                hoursWorked: attendanceData ? attendanceData.totalHours : 0,
                proRatedDeduction: attendanceData ? attendanceData.proRatedDeduction : 0,
                AddedBy: attendanceData && attendanceData.AddedBy ? attendanceData.AddedBy : null,
                ModifiedBy: attendanceData && attendanceData.ModifiedBy ? attendanceData.ModifiedBy : null,
                modifiedDate: (attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.modifiedDate) ? attendanceData.modifiedDate : undefined,
                totalHours: attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.totalHours
            });
        }
        return userAttendance;
    }
    async validateUser(userId) {
        let user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (user) {
            return user;
        }
        else {
            throw {
                message: "No User Found",
                statusCode: 404
            };
        }
    }
    triggerBulkAttendanceCalculation() {
        this.attendanceQueue.add('prepareBulkAttendanceReport', {
            message: "Start Preparing All Attendance Report"
        }, { removeOnComplete: true });
    }
    findOrganization(organizationId) {
        return this.prisma.organization.findFirst({
            where: {
                id: organizationId
            },
            include: {
                WorkingHours: true
            }
        });
    }
    async generateReport(reportDto) {
        let condition = {};
        if (reportDto.reportType === generate_report_dto_1.AttendanceReportType.department) {
            condition = Object.assign(Object.assign({}, condition), { departmentId: reportDto.departmentId });
        }
        else if (reportDto.reportType === generate_report_dto_1.AttendanceReportType.organization) {
            condition = Object.assign(Object.assign({}, condition), { organizationId: reportDto.organizationId });
        }
        else if (reportDto.reportType === generate_report_dto_1.AttendanceReportType.users) {
            condition = Object.assign(Object.assign({}, condition), { id: {
                    in: reportDto.userIds
                } });
        }
        let allUsers = await this.prisma.user.findMany({
            where: Object.assign(Object.assign({ isDeleted: false }, condition), { AND: {
                    OR: [
                        {
                            status: constants_1.UserStatus.active
                        },
                        {
                            status: constants_1.UserStatus.suspended,
                            lastWorkingDate: {
                                gte: reportDto.fromDate
                            }
                        }
                    ]
                } }),
            orderBy: {
                firstName: 'asc'
            },
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
            fromDate: reportDto.fromDate,
            toDate: reportDto.toDate,
            userId: null
        };
        let publicHolidayFilters = this.applyFiltersPublicHolidays(filters);
        let publicHolidays = await this.findPublicHolidays(publicHolidayFilters);
        let reportSheets = [];
        const MAX_CONCURRENT_OPERATIONS = 10;
        let reportIndex = 0;
        await BluebirdPromise.map(allUsers, async (user) => {
            try {
                filters.userId = user.id;
                let appliedFilters = this.applyFilters(filters);
                let org = organizationData.find((ele) => ele.id === user.organizationId);
                if (!org.WorkingHours) {
                    throw {
                        message: "No Working Hours Assigned to the Company" + org.name,
                        statusCode: 400
                    };
                }
                let curIndex = reportIndex++;
                let userAttendance = await this.findAll(appliedFilters, { page: 1, perPage: 32 }, { sortByField: 'checkIn', sortOrder: 'asc' });
                let attendanceData = this.prepareAttendanceFromD1ToD2(userAttendance, publicHolidays, filters, org.WorkingHours);
                reportSheets[curIndex] = {
                    sheetName: user.firstName + " " + user.lastName,
                    data: {
                        employee: user,
                        attendance: attendanceData
                    }
                };
            }
            catch (err) {
                this.logger.error("Some error while preparing attendance report", err === null || err === void 0 ? void 0 : err.message);
            }
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
        let attendanceFileName = "Attendance-Report-from-" + (0, common_2.convertDate)(reportDto.fromDate, 'dd-mm-yy') + "-to-" + (0, common_2.convertDate)(reportDto.toDate, 'dd-mm-yy') + ".xlsx";
        let attendanceFilepath = process.cwd() + "/public/attendance/";
        if (!(0, fs_1.existsSync)(attendanceFilepath)) {
            (0, fs_1.mkdirSync)(attendanceFilepath, { recursive: true });
        }
        let filePath = attendanceFilepath + attendanceFileName;
        await this.excelService.attendanceExcelReport(reportSheets, filePath);
        return {
            fileName: attendanceFileName,
            filePath: attendanceFilepath + attendanceFileName
        };
    }
    remove(id) {
        return this.prisma.attendance.delete({
            where: {
                id: id
            }
        });
    }
};
AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('attendance')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, excel_service_1.ExcelService])
], AttendanceService);
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendance.service.js.map