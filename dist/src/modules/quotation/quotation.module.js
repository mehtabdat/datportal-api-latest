"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationModule = void 0;
const common_1 = require("@nestjs/common");
const quotation_service_1 = require("./quotation.service");
const quotation_controller_1 = require("./quotation.controller");
const quotation_authorization_service_1 = require("./quotation.authorization.service");
const mail_service_1 = require("../../mail/mail.service");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
let QuotationModule = class QuotationModule {
};
QuotationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'xero',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [quotation_controller_1.QuotationController],
        providers: [quotation_service_1.QuotationService, quotation_authorization_service_1.QuotationAuthorizationService, mail_service_1.MailService]
    })
], QuotationModule);
exports.QuotationModule = QuotationModule;
//# sourceMappingURL=quotation.module.js.map