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
exports.AlertsTypeController = void 0;
const common_1 = require("@nestjs/common");
const alerts_type_service_1 = require("./alerts-type.service");
const create_alerts_type_dto_1 = require("./dto/create-alerts-type.dto");
const update_alerts_type_dto_1 = require("./dto/update-alerts-type.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const alerts_type_dto_1 = require("./dto/alerts-type.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const alerts_type_permissions_1 = require("./alerts-type.permissions");
const moduleName = "alerts-type";
let AlertsTypeController = class AlertsTypeController {
    constructor(alertsTypeService) {
        this.alertsTypeService = alertsTypeService;
    }
    async create(createAlertsTypeDto) {
        try {
            let data = await this.alertsTypeService.create(createAlertsTypeDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(req) {
        try {
            let data = await this.alertsTypeService.findAllPublished(req.user);
            return {
                message: `${moduleName} fetched Successfully`, statusCode: 200, data: data
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findBySlug(findBySlugDto, req) {
        try {
            let data = await this.alertsTypeService.findBySlug(findBySlugDto.slug, req.user);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll() {
        try {
            let data = await this.alertsTypeService.findAll();
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.alertsTypeService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateAlertsTypeDto) {
        try {
            let data = await this.alertsTypeService.update(params.id, updateAlertsTypeDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.alertsTypeService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(alerts_type_permissions_1.AlertsTypePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_alerts_type_dto_1.CreateAlertsTypeDto]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "findPublished", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseObject, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-by-slug/:slug'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.FindBySlugDto, Object]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "findBySlug", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(alerts_type_permissions_1.AlertsTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(alerts_type_permissions_1.AlertsTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(alerts_type_permissions_1.AlertsTypePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto,
        update_alerts_type_dto_1.UpdateAlertsTypeDto]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(alerts_type_permissions_1.AlertsTypePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: alerts_type_dto_1.AlertsTypeResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], AlertsTypeController.prototype, "remove", null);
AlertsTypeController = __decorate([
    (0, swagger_1.ApiTags)("alerts-type"),
    (0, common_1.Controller)('alerts-type'),
    __metadata("design:paramtypes", [alerts_type_service_1.AlertsTypeService])
], AlertsTypeController);
exports.AlertsTypeController = AlertsTypeController;
//# sourceMappingURL=alerts-type.controller.js.map