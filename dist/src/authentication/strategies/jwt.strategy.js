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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwt_constants_1 = require("../../config/jwt-constants");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt_constants_1.jwtConstants.accessTokensecret,
        });
    }
    async validate(payload) {
        var _a, _b, _c;
        return { userId: payload.userId, userUid: payload.userUid, userEmail: payload.userEmail, roles: payload.roles,
            organization: (payload.organization) ? Object.assign({}, payload.organization) : undefined,
            litmitAccessTo: payload.litmitAccessTo,
            department: (payload.department) ? {
                id: (_a = payload === null || payload === void 0 ? void 0 : payload.department) === null || _a === void 0 ? void 0 : _a.id,
                title: (_b = payload === null || payload === void 0 ? void 0 : payload.department) === null || _b === void 0 ? void 0 : _b.slug,
                slug: (_c = payload === null || payload === void 0 ? void 0 : payload.department) === null || _c === void 0 ? void 0 : _c.slug
            } : undefined };
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map