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
exports.LeaveCreditController = void 0;
const common_1 = require("@nestjs/common");
const leave_credit_service_1 = require("./leave-credit.service");
const create_leave_credit_dto_1 = require("./dto/create-leave-credit.dto");
const update_leave_credit_dto_1 = require("./dto/update-leave-credit.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const leave_credit_dto_1 = require("./dto/leave-credit.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const leave_credit_permissions_1 = require("./leave-credit.permissions");
const moduleName = "leave-credit";
let LeaveCreditController = class LeaveCreditController {
    constructor(leaveCreditService) {
        this.leaveCreditService = leaveCreditService;
    }
    async create(createDto) {
        try {
            let data = await this.leaveCreditService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.leaveCreditService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.leaveCreditService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_credit_permissions_1.LeaveCreditPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_credit_dto_1.LeaveCreditResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_credit_dto_1.CreateLeaveCreditDto]),
    __metadata("design:returntype", Promise)
], LeaveCreditController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_credit_permissions_1.LeaveCreditPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_credit_dto_1.LeaveCreditResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_leave_credit_dto_1.UpdateLeaveCreditDto]),
    __metadata("design:returntype", Promise)
], LeaveCreditController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_credit_permissions_1.LeaveCreditPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_credit_dto_1.LeaveCreditResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], LeaveCreditController.prototype, "remove", null);
LeaveCreditController = __decorate([
    (0, swagger_1.ApiTags)("leave-credit"),
    (0, common_1.Controller)('leave-credit'),
    __metadata("design:paramtypes", [leave_credit_service_1.LeaveCreditService])
], LeaveCreditController);
exports.LeaveCreditController = LeaveCreditController;
//# sourceMappingURL=leave-credit.controller.js.map