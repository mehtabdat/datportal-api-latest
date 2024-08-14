"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XeroAccountingModule = void 0;
const common_1 = require("@nestjs/common");
const xero_accounting_service_1 = require("./xero-accounting.service");
const xero_accounting_controller_1 = require("./xero-accounting.controller");
const redis_service_1 = require("../redis/redis.service");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const xero_accounting_processor_1 = require("./process/xero-accounting.processor");
const xero_accounting_processor_service_1 = require("./process/xero-accounting.processor.service");
let XeroAccountingModule = class XeroAccountingModule {
};
XeroAccountingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'xero',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        providers: [xero_accounting_service_1.XeroAccountingService, redis_service_1.RedisService, xero_accounting_processor_1.XeroProcessor, xero_accounting_processor_service_1.XeroProcessorService],
        controllers: [xero_accounting_controller_1.XeroAccountingController]
    })
], XeroAccountingModule);
exports.XeroAccountingModule = XeroAccountingModule;
//# sourceMappingURL=xero-accounting.module.js.map