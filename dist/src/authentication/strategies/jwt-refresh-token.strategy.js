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
exports.JwtRefreshTokenStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwt_constants_1 = require("../../config/jwt-constants");
const auth_service_1 = require("../auth.service");
let JwtRefreshTokenStrategy = class JwtRefreshTokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh-token') {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField("refreshToken"),
            ignoreExpiration: false,
            secretOrKey: jwt_constants_1.jwtConstants.refreshTokenSecret,
            passReqToCallback: true
        });
        this.authService = authService;
    }
    async validate(req, payload) {
        try {
            const refreshToken = this.getToken(req);
            if (refreshToken) {
                const isValidToken = await this.authService.validateRefreshToken(refreshToken, payload.userId);
                if (!isValidToken)
                    throw new Error;
                return payload;
            }
        }
        catch (err) {
            let errorResponse = { message: "Token invalid, expired or may be regenerated already, please login again to get the access token", statusCode: 404, data: {} };
            throw new common_1.NotFoundException(errorResponse);
        }
    }
    getToken(req) {
        if (req.body.refreshToken) {
            return req.body.refreshToken;
        }
        return null;
    }
};
JwtRefreshTokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], JwtRefreshTokenStrategy);
exports.JwtRefreshTokenStrategy = JwtRefreshTokenStrategy;
//# sourceMappingURL=jwt-refresh-token.strategy.js.map