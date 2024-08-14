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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_constants_1 = require("../config/jwt-constants");
let TokenService = class TokenService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async verifyUserToken(token, ignoreExpiration = false) {
        token = token.replace('Bearer ', '');
        const verifyOptions = { secret: jwt_constants_1.jwtConstants.accessTokensecret, ignoreExpiration: ignoreExpiration };
        try {
            const payload = await this.jwtService.verifyAsync(token, verifyOptions);
            return payload;
        }
        catch (err) {
            throw { message: err.message, statusCode: 401 };
        }
    }
    async verifyUserSubscriptionToken(token, ignoreExpiration = false) {
        token = token.replace('Bearer ', '');
        const verifyOptions = { secret: jwt_constants_1.jwtConstants.userSubscriptionTokenSecret, ignoreExpiration: ignoreExpiration };
        try {
            const payload = await this.jwtService.verifyAsync(token, verifyOptions);
            return payload;
        }
        catch (err) {
            throw { message: err.message, statusCode: 401 };
        }
    }
    generateUnsubscribeToken(userId) {
        const payload = {
            userId: userId
        };
        return this.jwtService.sign(payload, { secret: jwt_constants_1.jwtConstants.userSubscriptionTokenSecret, expiresIn: jwt_constants_1.jwtConstants.userSubscriptionTokenExpiry });
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map