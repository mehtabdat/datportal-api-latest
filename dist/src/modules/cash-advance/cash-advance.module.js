"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashAdvanceModule = void 0;
const common_1 = require("@nestjs/common");
const cash_advance_service_1 = require("./cash-advance.service");
const cash_advance_controller_1 = require("./cash-advance.controller");
const cash_advance_authorization_service_1 = require("./cash-advance.authorization.service");
let CashAdvanceModule = class CashAdvanceModule {
};
CashAdvanceModule = __decorate([
    (0, common_1.Module)({
        controllers: [cash_advance_controller_1.CashAdvanceController],
        providers: [cash_advance_service_1.CashAdvanceService, cash_advance_authorization_service_1.CashAdvanceAuthorizationService]
    })
], CashAdvanceModule);
exports.CashAdvanceModule = CashAdvanceModule;
//# sourceMappingURL=cash-advance.module.js.map