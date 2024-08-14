"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsTypeModule = void 0;
const common_1 = require("@nestjs/common");
const alerts_type_service_1 = require("./alerts-type.service");
const alerts_type_controller_1 = require("./alerts-type.controller");
let AlertsTypeModule = class AlertsTypeModule {
};
AlertsTypeModule = __decorate([
    (0, common_1.Module)({
        controllers: [alerts_type_controller_1.AlertsTypeController],
        providers: [alerts_type_service_1.AlertsTypeService]
    })
], AlertsTypeModule);
exports.AlertsTypeModule = AlertsTypeModule;
//# sourceMappingURL=alerts-type.module.js.map