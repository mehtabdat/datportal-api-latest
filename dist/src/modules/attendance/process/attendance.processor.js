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
exports.AttendanceProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const attendance_processor_service_1 = require("./attendance.processor.service");
let AttendanceProcessor = class AttendanceProcessor {
    constructor(attendanceProcessorService) {
        this.attendanceProcessorService = attendanceProcessorService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async prepareAttendanceReport(job) {
        try {
            await this.attendanceProcessorService.bulkProcessAttendance(new Date());
        }
        catch (err) {
            console.log("Attendance Process Error", err.message);
        }
    }
    async prepareBulkAttendanceReport(job) {
        try {
            await this.attendanceProcessorService.bulkProcessAttendance(new Date());
        }
        catch (err) {
            console.log("Bulk Attendance Process Error", err.message);
        }
    }
    globalHandler(job) {
        this.logger.error('No listners were provided, fall back to default', job.data);
    }
};
__decorate([
    (0, bull_1.Process)('prepareAttendanceReport'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceProcessor.prototype, "prepareAttendanceReport", null);
__decorate([
    (0, bull_1.Process)('prepareBulkAttendanceReport'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceProcessor.prototype, "prepareBulkAttendanceReport", null);
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceProcessor.prototype, "globalHandler", null);
AttendanceProcessor = __decorate([
    (0, bull_1.Processor)('attendance'),
    __metadata("design:paramtypes", [attendance_processor_service_1.AttendanceProcessorService])
], AttendanceProcessor);
exports.AttendanceProcessor = AttendanceProcessor;
//# sourceMappingURL=attendance.processor.js.map