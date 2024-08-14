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
exports.UserAlertsSettingController = void 0;
const common_1 = require("@nestjs/common");
const user_alerts_setting_service_1 = require("./user-alerts-setting.service");
const create_user_alerts_setting_dto_1 = require("./dto/create-user-alerts-setting.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const user_alerts_setting_dto_1 = require("./dto/user-alerts-setting.dto");
const moduleName = "user-alerts-setting";
let UserAlertsSettingController = class UserAlertsSettingController {
    constructor(UserAlertsSettingService) {
        this.UserAlertsSettingService = UserAlertsSettingService;
    }
    async create(createPropertyTypeCategoryRelationDto, req) {
        try {
            let data = await this.UserAlertsSettingService.createOrUpdate(createPropertyTypeCategoryRelationDto, req.user);
            return { message: `Alerts updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async unsubscribeAll(req) {
        try {
            let data = await this.UserAlertsSettingService.unsubscribeAll(req.user);
            return { message: `You have been unsubscribed from all notifications.`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOneBySlug(params, req) {
        try {
            let data = await this.UserAlertsSettingService.findBySlug(params.alertTypeSlug, req.user.userId);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params, req) {
        try {
            let data = await this.UserAlertsSettingService.findOne(params.alertTypeId, req.user.userId);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_alerts_setting_dto_1.UserAlertsSettingResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)('subscribe-unsubscribe'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_alerts_setting_dto_1.CreateUserAlertsSettingDto, Object]),
    __metadata("design:returntype", Promise)
], UserAlertsSettingController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_alerts_setting_dto_1.UserAlertsSettingResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Patch)('unsubscribe-all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAlertsSettingController.prototype, "unsubscribeAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by category Id and type Id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_alerts_setting_dto_1.UserAlertsSettingResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('find-user-alert-by-slug/:alertTypeSlug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.FindBySlugDto, Object]),
    __metadata("design:returntype", Promise)
], UserAlertsSettingController.prototype, "findOneBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by category Id and type Id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: user_alerts_setting_dto_1.UserAlertsSettingResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':alertTypeId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], UserAlertsSettingController.prototype, "findOne", null);
UserAlertsSettingController = __decorate([
    (0, swagger_1.ApiTags)("user-alerts-setting"),
    (0, common_1.Controller)('user-alerts-setting'),
    __metadata("design:paramtypes", [user_alerts_setting_service_1.UserAlertsSettingService])
], UserAlertsSettingController);
exports.UserAlertsSettingController = UserAlertsSettingController;
//# sourceMappingURL=user-alerts-setting.controller.js.map