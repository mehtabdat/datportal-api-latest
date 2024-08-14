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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const public_metadata_1 = require("./authentication/public-metadata");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello(req) {
        console.log("In Get Hello");
        console.log("Body", req.body);
        console.log("Params", req.params);
        console.log("Query", req.query);
        return this.appService.getHello();
    }
    getTest(req) {
        console.log("In biometrics-test get");
        console.log("Body", req.body);
        console.log("Params", req.params);
        console.log("Query", req.query);
        return this.appService.getHello();
    }
    postHello(req) {
        console.log("In biometrics-test post");
        console.log("Body", req.body);
        console.log("Params", req.params);
        console.log("Query", req.query);
        return this.appService.getHello();
    }
};
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.Get)('biometrics-test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "getTest", null);
__decorate([
    (0, public_metadata_1.Public)(),
    (0, common_1.Post)('biometrics-test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "postHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map