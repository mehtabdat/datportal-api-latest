"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPasswordResetTokenStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwt_constants_1 = require("../../config/jwt-constants");
const auth_service_1 = require("../auth.service");
const constants_1 = require("../../config/constants");
let JwtPasswordResetTokenStrategy = class JwtPasswordResetTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-password-reset-token') {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField("resetToken"),
            ignoreExpiration: false,
            secretOrKey: jwt_constants_1.jwtConstants.passwordResetTokenSecret,
            passReqToCallback: true
        });
        this.authService = authService;
    }
    async validate(req, payload) {
        try {
            const resetToken = this.getToken(req);
            if (!resetToken)
                throw new Error;
            if (resetToken) {
                const tokenData = await this.authService.validatePasswordResetToken(resetToken);
                if (tokenData) {
                    if (tokenData.status === constants_1.AuthTokenStatus.active) {
                        return payload;
                    }
                    else if (tokenData.status == constants_1.AuthTokenStatus.expired) {
                        throw {
                            message: "Token invalid. You have requested a new reset token. Please try with new token received.",
                            statusCode: 400
                        };
                    }
                    else if (tokenData.status == constants_1.AuthTokenStatus.used) {
                        throw {
                            message: "You have already updated the password using this token. Pleae request for a new token and try again",
                            statusCode: 400
                        };
                    }
                    else {
                        return payload;
                    }
                }
                else {
                    throw {
                        message: "Reset Token not found. Please request for a new token and try again.",
                        statusCode: 404
                    };
                }
            }
        }
        catch (err) {
            let errorResponse = { message: err.message, statusCode: err.statusCode, data: {} };
            throw new common_1.NotFoundException(errorResponse);
        }
    }
    getToken(req) {
        if (req.body.resetToken) {
            return req.body.resetToken;
        }
        return null;
    }
};
JwtPasswordResetTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], JwtPasswordResetTokenStrategy);
exports.JwtPasswordResetTokenStrategy = JwtPasswordResetTokenStrategy;
//# sourceMappingURL=jwt-password-reset-token.strategy.js.map