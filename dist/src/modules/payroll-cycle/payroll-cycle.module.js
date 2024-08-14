"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollCycleModule = void 0;
const common_1 = require("@nestjs/common");
const payroll_cycle_service_1 = require("./payroll-cycle.service");
const payroll_cycle_controller_1 = require("./payroll-cycle.controller");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const payroll_cycle_cronjob_1 = require("./payroll-cycle.cronjob");
let PayrollCycleModule = class PayrollCycleModule {
};
PayrollCycleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'payroll',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [payroll_cycle_controller_1.PayrollCycleController],
        providers: [payroll_cycle_service_1.PayrollCycleService, payroll_cycle_cronjob_1.PayrollCycleCronJob]
    })
], PayrollCycleModule);
exports.PayrollCycleModule = PayrollCycleModule;
//# sourceMappingURL=payroll-cycle.module.js.map