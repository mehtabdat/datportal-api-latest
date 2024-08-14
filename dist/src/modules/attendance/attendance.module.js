"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const attendance_controller_1 = require("./attendance.controller");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const attendance_processor_service_1 = require("./process/attendance.processor.service");
const attendance_processor_1 = require("./process/attendance.processor");
const attendance_cronjob_1 = require("./attendance.cronjob");
const attendance_authorization_service_1 = require("./attendance.authorization.service");
const excel_service_1 = require("../file-convertor/excel.service");
let AttendanceModule = class AttendanceModule {
};
AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'attendance',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [attendance_controller_1.AttendanceController],
        providers: [attendance_service_1.AttendanceService, attendance_processor_service_1.AttendanceProcessorService, attendance_processor_1.AttendanceProcessor, attendance_cronjob_1.AttendanceCronJob, attendance_authorization_service_1.AttendanceAuthorizationService, excel_service_1.ExcelService]
    })
], AttendanceModule);
exports.AttendanceModule = AttendanceModule;
//# sourceMappingURL=attendance.module.js.map