"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollModule = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const payroll_controller_1 = require("./payroll.controller");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const payroll_processor_service_1 = require("./process/payroll.processor.service");
const payroll_processor_1 = require("./process/payroll.processor");
const payroll_authorization_service_1 = require("./payroll.authorization.service");
const attendance_service_1 = require("../attendance/attendance.service");
const excel_service_1 = require("../file-convertor/excel.service");
let PayrollModule = class PayrollModule {
};
PayrollModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'payroll',
                configKey: constants_1.REDIS_DB_NAME,
            }),
            bull_1.BullModule.registerQueue({
                name: 'attendance',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [payroll_controller_1.PayrollController],
        providers: [payroll_service_1.PayrollService, payroll_processor_1.PayrollProcessor, payroll_processor_service_1.PayrollProcessorService, payroll_authorization_service_1.PayrollAuthorizationService, attendance_service_1.AttendanceService, excel_service_1.ExcelService]
    })
], PayrollModule);
exports.PayrollModule = PayrollModule;
//# sourceMappingURL=payroll.module.js.map