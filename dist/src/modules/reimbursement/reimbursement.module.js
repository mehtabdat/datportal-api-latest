"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReimbursementModule = void 0;
const common_1 = require("@nestjs/common");
const reimbursement_service_1 = require("./reimbursement.service");
const reimbursement_controller_1 = require("./reimbursement.controller");
const reimbursement_authorization_service_1 = require("./reimbursement.authorization.service");
let ReimbursementModule = class ReimbursementModule {
};
ReimbursementModule = __decorate([
    (0, common_1.Module)({
        controllers: [reimbursement_controller_1.ReimbursementController],
        providers: [reimbursement_service_1.ReimbursementService, reimbursement_authorization_service_1.ReimbursementAuthorizationService]
    })
], ReimbursementModule);
exports.ReimbursementModule = ReimbursementModule;
//# sourceMappingURL=reimbursement.module.js.map