"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const project_controller_1 = require("./project.controller");
const project_authorization_service_1 = require("./project.authorization.service");
const mail_service_1 = require("../../mail/mail.service");
const chat_gateway_1 = require("../chat/chat.gateway");
const token_service_1 = require("../../authentication/token.service");
const jwt_1 = require("@nestjs/jwt");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
let ProjectModule = class ProjectModule {
};
ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'xero',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [project_controller_1.ProjectController],
        providers: [project_service_1.ProjectService, project_authorization_service_1.ProjectAuthorizationService, mail_service_1.MailService, chat_gateway_1.ChatGateway, token_service_1.TokenService, jwt_1.JwtService]
    })
], ProjectModule);
exports.ProjectModule = ProjectModule;
//# sourceMappingURL=project.module.js.map