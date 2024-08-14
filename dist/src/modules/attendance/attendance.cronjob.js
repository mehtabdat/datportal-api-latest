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
var AttendanceCronJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceCronJob = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let AttendanceCronJob = AttendanceCronJob_1 = class AttendanceCronJob {
    constructor(attendanceQueue) {
        this.attendanceQueue = attendanceQueue;
        this.logger = new common_1.Logger(AttendanceCronJob_1.name);
    }
    async prepareAttendanceReport() {
        this.logger.debug("Called every day at 01:00AM to find user attendance");
        this.attendanceQueue.add('prepareAttendanceReport', {
            message: "Start Preparing Attendance Report"
        }, { removeOnComplete: true });
    }
};
__decorate([
    (0, schedule_1.Cron)('0 1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceCronJob.prototype, "prepareAttendanceReport", null);
AttendanceCronJob = AttendanceCronJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('attendance')),
    __metadata("design:paramtypes", [Object])
], AttendanceCronJob);
exports.AttendanceCronJob = AttendanceCronJob;
//# sourceMappingURL=attendance.cronjob.js.map