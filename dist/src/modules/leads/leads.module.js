"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsModule = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const leads_controller_1 = require("./leads.controller");
const mail_service_1 = require("../../mail/mail.service");
const leads_authorization_service_1 = require("./leads.authorization.service");
const system_logger_service_1 = require("../system-logs/system-logger.service");
let LeadsModule = class LeadsModule {
};
LeadsModule = __decorate([
    (0, common_1.Module)({
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService, mail_service_1.MailService, leads_authorization_service_1.LeadsAuthorizationService, system_logger_service_1.SystemLogger]
    })
], LeadsModule);
exports.LeadsModule = LeadsModule;
//# sourceMappingURL=leads.module.js.map