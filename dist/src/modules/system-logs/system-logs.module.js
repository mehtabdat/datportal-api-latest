"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogsModule = void 0;
const common_1 = require("@nestjs/common");
const system_logs_service_1 = require("./system-logs.service");
const system_logs_controller_1 = require("./system-logs.controller");
const system_logger_service_1 = require("./system-logger.service");
let SystemLogsModule = class SystemLogsModule {
};
SystemLogsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [system_logs_controller_1.SystemLogsController],
        providers: [system_logs_service_1.SystemLogsService, system_logger_service_1.SystemLogger],
        exports: [system_logger_service_1.SystemLogger]
    })
], SystemLogsModule);
exports.SystemLogsModule = SystemLogsModule;
//# sourceMappingURL=system-logs.module.js.map