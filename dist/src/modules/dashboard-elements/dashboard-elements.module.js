"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardElementsModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_elements_service_1 = require("./dashboard-elements.service");
const dashboard_elements_controller_1 = require("./dashboard-elements.controller");
const dashboard_elements_authorization_service_1 = require("./dashboard-elements.authorization.service");
let DashboardElementsModule = class DashboardElementsModule {
};
DashboardElementsModule = __decorate([
    (0, common_1.Module)({
        controllers: [dashboard_elements_controller_1.DashboardElementsController],
        providers: [dashboard_elements_service_1.DashboardElementsService, dashboard_elements_authorization_service_1.DashboardAuthorizationService]
    })
], DashboardElementsModule);
exports.DashboardElementsModule = DashboardElementsModule;
//# sourceMappingURL=dashboard-elements.module.js.map