"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesModule = void 0;
const common_1 = require("@nestjs/common");
const resources_service_1 = require("./resources.service");
const resources_controller_1 = require("./resources.controller");
const authorization_service_1 = require("../../authorization/authorization.service");
const jwt_1 = require("@nestjs/jwt");
const token_service_1 = require("../../authentication/token.service");
let ResourcesModule = class ResourcesModule {
};
ResourcesModule = __decorate([
    (0, common_1.Module)({
        controllers: [resources_controller_1.ResourcesController],
        providers: [resources_service_1.ResourcesService, authorization_service_1.AuthorizationService, jwt_1.JwtService, token_service_1.TokenService]
    })
], ResourcesModule);
exports.ResourcesModule = ResourcesModule;
//# sourceMappingURL=resources.module.js.map