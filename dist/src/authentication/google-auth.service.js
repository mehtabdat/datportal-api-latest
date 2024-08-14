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
exports.GoogleAuthService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
let GoogleAuthService = class GoogleAuthService {
    constructor() {
        const clientID = process.env.GOOGLE_AUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;
        this.oauthClient = new googleapis_1.google.auth.OAuth2(clientID, clientSecret);
    }
    async authenticate(token) {
        try {
            this.oauthClient.setCredentials({ access_token: token });
            let oauth2 = googleapis_1.google.oauth2({
                auth: this.oauthClient,
                version: 'v2'
            });
            let { data } = await oauth2.userinfo.get();
            let tokenInfo = data;
            const email = tokenInfo.email;
            if (!email) {
                throw { message: "Couldnot fetch user from the given token", statusCode: 404 };
            }
            return {
                email: tokenInfo.email,
                firstName: tokenInfo.given_name,
                lastName: tokenInfo.family_name,
                profile: tokenInfo.picture
            };
        }
        catch (err) {
            throw { message: err.message, statusCode: 400 };
        }
    }
};
GoogleAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleAuthService);
exports.GoogleAuthService = GoogleAuthService;
//# sourceMappingURL=google-auth.service.js.map