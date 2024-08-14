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
var AttendanceProcessorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceProcessorService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../../config/constants");
const common_2 = require("../../../helpers/common");
const prisma_service_1 = require("../../../prisma.service");
const BluebirdPromise = require("bluebird");
const attendance_service_1 = require("../attendance.service");
let AttendanceProcessorService = AttendanceProcessorService_1 = class AttendanceProcessorService {
    constructor(prisma, attendanceService) {
        this.prisma = prisma;
        this.attendanceService = attendanceService;
        this.logger = new common_1.Logger(AttendanceProcessorService_1.name);
    }
    async bulkProcessAttendance(beforeDate) {
        let query = `SELECT "userId", DATE("checkIn") as "checkInDate"
                FROM "BiometricsChecks"
                WHERE "checkIn" < '${beforeDate.toISOString()}'
                AND "isProcessed" = FALSE
                GROUP BY "userId", "checkInDate"
                ORDER BY "checkInDate" DESC
                ;`;
        const allUsersToProcess = await this.prisma.$queryRawUnsafe(query);
        if (allUsersToProcess.length === 0) {
            this.logger.error("There are no new biometrics records to process");
            return;
        }
        const MAX_CONCURRENT_OPERATIONS = 10;
        console.log(`Processing ${allUsersToProcess.length} items`);
        await BluebirdPromise.map(allUsersToProcess, async (emp) => {
            try {
                const { dayStart, dayEnd } = (0, common_2.getDayRange)(emp.checkInDate);
                await this.userAttendanceOfGivenDate(emp.userId, dayStart, dayEnd);
            }
            catch (err) {
                this.logger.error("Some error while adding attendance", err.message);
            }
        }, { concurrency: MAX_CONCURRENT_OPERATIONS });
    }
    async userAttendanceOfGivenDate(userId, dayStart, dayEnd) {
        let existingRecord = await this.prisma.attendance.findFirst({
            where: {
                userId: userId,
                AND: [
                    {
                        checkIn: {
                            gte: dayStart
                        }
                    },
                    {
                        checkIn: {
                            lte: dayEnd
                        }
                    }
                ]
            }
        });
        const __checkIn = this.prisma.biometricsChecks.findFirst({
            where: {
                userId: userId,
                AND: [
                    { checkIn: { gte: dayStart } },
                    { checkIn: { lte: dayEnd } }
                ]
            },
            orderBy: { checkIn: 'asc' }
        });
        const __checkOut = this.prisma.biometricsChecks.findFirst({
            where: {
                userId: userId,
                AND: [
                    { checkIn: { gte: dayStart } },
                    { checkIn: { lte: dayEnd } }
                ]
            },
            orderBy: { checkIn: 'desc' }
        });
        const [checkInData, checkOutData] = await Promise.all([__checkIn, __checkOut]);
        if (!checkInData) {
            throw {
                message: `No Check in data found UserId:${userId}  Date Start: ${dayStart.toISOString()} - Day End: ${dayEnd.toISOString()}`
            };
        }
        if (!checkOutData) {
            throw {
                message: `No Check out data found UserId:${userId}  Date Start: ${dayStart.toISOString()} - Day End: ${dayEnd.toISOString()}`
            };
        }
        if (existingRecord) {
            if (existingRecord.checkIn.getTime() === checkInData.checkIn.getTime() && existingRecord.checkOut.getTime() === checkOutData.checkIn.getTime()) {
                throw {
                    message: `Attendance for the given user: ${userId} in ${dayStart.toString()} already exists`,
                };
            }
            else {
                await this.prisma.attendance.delete({
                    where: {
                        id: existingRecord.id
                    }
                });
            }
        }
        let userData = await this.prisma.user.findFirst({
            where: {
                id: userId
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
        let hoursWorked = Math.abs((0, common_2.calculateTotalHours)(checkInData.checkIn, checkOutData.checkIn));
        let status = this.attendanceService.checkAttendanceStatus(checkInData.checkIn, hoursWorked, organization.WorkingHours);
        let proRatedDeduction = this.attendanceService.calculateIncompleteDeduction(status, checkInData.checkIn, hoursWorked, organization.WorkingHours);
        await this.prisma.attendance.create({
            data: {
                type: constants_1.AttendanceEntryType.auto,
                addedDate: new Date(),
                checkIn: checkInData.checkIn,
                checkOut: checkOutData.checkIn,
                totalHours: hoursWorked,
                staus: status,
                proRatedDeduction: proRatedDeduction,
                userId: userId
            }
        }).then((data) => {
            this.logger.log(`New Attendance added, UserID:${data.userId} ID:${data.id}`);
        }).catch((err) => {
            this.logger.log(`Some error while adding attendance of userId:${userId} Date:${checkInData.checkIn.toString()} `, err.message);
        });
        await this.prisma.biometricsChecks.updateMany({
            where: {
                userId: userId,
                AND: [
                    { checkIn: { gte: dayStart } },
                    { checkIn: { lte: dayEnd } }
                ]
            },
            data: {
                isProcessed: true
            }
        });
    }
};
AttendanceProcessorService = AttendanceProcessorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, attendance_service_1.AttendanceService])
], AttendanceProcessorService);
exports.AttendanceProcessorService = AttendanceProcessorService;
//# sourceMappingURL=attendance.processor.service.js.map