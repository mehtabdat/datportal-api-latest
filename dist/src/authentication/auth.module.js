"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../prisma.service");
const user_module_1 = require("../modules/user/user.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_constants_1 = require("../config/jwt-constants");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const jwt_refresh_token_strategy_1 = require("./strategies/jwt-refresh-token.strategy");
const jwt_phone_signup_token_strategy_1 = require("./strategies/jwt-phone-signup-token.strategy");
const jwt_email_signup_token_strategy_1 = require("./strategies/jwt-email-signup-token.strategy");
const jwt_password_reset_token_strategy_1 = require("./strategies/jwt-password-reset-token.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const local_strategy_1 = require("./strategies/local.strategy");
const mail_module_1 = require("../mail/mail.module");
const token_service_1 = require("./token.service");
const google_auth_service_1 = require("./google-auth.service");
const google_strategy_1 = require("./strategies/google.strategy");
const authorization_service_1 = require("../authorization/authorization.service");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            mail_module_1.MailModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: jwt_constants_1.jwtConstants.accessTokensecret,
                signOptions: { expiresIn: jwt_constants_1.jwtConstants.accessTokenExpiry },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            token_service_1.TokenService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            jwt_refresh_token_strategy_1.JwtRefreshTokenStrategy,
            jwt_phone_signup_token_strategy_1.JwtPhoneSignupTokenStrategy,
            jwt_email_signup_token_strategy_1.JwtEmailSignupTokenStrategy,
            jwt_password_reset_token_strategy_1.JwtPasswordResetTokenStrategy,
            prisma_service_1.PrismaService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            google_auth_service_1.GoogleAuthService,
            google_strategy_1.GoogleStrategy,
            authorization_service_1.AuthorizationService
        ],
        exports: [token_service_1.TokenService]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map