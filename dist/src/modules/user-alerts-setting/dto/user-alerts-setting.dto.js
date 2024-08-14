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
exports.UserAlertsSettingResponseArray = exports.UserAlertsSettingResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_alerts_setting_entity_1 = require("../entities/user-alerts-setting.entity");
class UserAlertsSettingResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserAlertsSettingResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserAlertsSettingResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", user_alerts_setting_entity_1.UserAlertsSetting)
], UserAlertsSettingResponseObject.prototype, "data", void 0);
exports.UserAlertsSettingResponseObject = UserAlertsSettingResponseObject;
class UserAlertsSettingResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserAlertsSettingResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserAlertsSettingResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", user_alerts_setting_entity_1.UserAlertsSetting)
], UserAlertsSettingResponseArray.prototype, "data", void 0);
exports.UserAlertsSettingResponseArray = UserAlertsSettingResponseArray;
//# sourceMappingURL=user-alerts-setting.dto.js.map