"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationModule = void 0;
const common_1 = require("@nestjs/common");
const authorization_service_1 = require("./authorization.service");
const prisma_service_1 = require("../prisma.service");
const core_1 = require("@nestjs/core");
const authorization_guard_1 = require("./guards/authorization.guard");
let AuthorizationModule = class AuthorizationModule {
};
AuthorizationModule = __decorate([
    (0, common_1.Module)({
        providers: [authorization_service_1.AuthorizationService, prisma_service_1.PrismaService,
            {
                provide: core_1.APP_GUARD,
                useClass: authorization_guard_1.AuthorizationGuard,
            },
        ],
    })
], AuthorizationModule);
exports.AuthorizationModule = AuthorizationModule;
//# sourceMappingURL=authorization.module.js.map