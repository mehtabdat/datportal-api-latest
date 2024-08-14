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
exports.LeaveTypeController = void 0;
const common_1 = require("@nestjs/common");
const leave_type_service_1 = require("./leave-type.service");
const create_leave_type_dto_1 = require("./dto/create-leave-type.dto");
const update_leave_type_dto_1 = require("./dto/update-leave-type.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const leave_type_dto_1 = require("./dto/leave-type.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const leave_type_permissions_1 = require("./leave-type.permissions");
const leave_type_filters_dto_1 = require("./dto/leave-type-filters.dto");
const moduleName = "leave-type";
let LeaveTypeController = class LeaveTypeController {
    constructor(leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }
    async create(createDto) {
        try {
            let data = await this.leaveTypeService.create(createDto);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findPublished(filters) {
        try {
            let appliedFilters = this.leaveTypeService.applyFilters(filters);
            appliedFilters = Object.assign(Object.assign({}, appliedFilters), { isPublished: true });
            let data = await this.leaveTypeService.findAll(appliedFilters);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters) {
        try {
            let appliedFilters = this.leaveTypeService.applyFilters(filters);
            let data = await this.leaveTypeService.findAll(appliedFilters);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findOne(params) {
        try {
            let data = await this.leaveTypeService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto) {
        try {
            let data = await this.leaveTypeService.update(params.id, updateDto);
            return { message: `${moduleName}  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.leaveTypeService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_type_permissions_1.LeaveTypePermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_type_dto_1.CreateLeaveTypeDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('find-published'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_type_filters_dto_1.LeaveTypeFilters]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findPublished", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_type_permissions_1.LeaveTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_type_filters_dto_1.LeaveTypeFilters]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_type_permissions_1.LeaveTypePermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_type_permissions_1.LeaveTypePermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_leave_type_dto_1.UpdateLeaveTypeDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_type_permissions_1.LeaveTypePermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_type_dto_1.LeaveTypeResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "remove", null);
LeaveTypeController = __decorate([
    (0, swagger_1.ApiTags)("leave-type"),
    (0, common_1.Controller)('leave-type'),
    __metadata("design:paramtypes", [leave_type_service_1.LeaveTypeService])
], LeaveTypeController);
exports.LeaveTypeController = LeaveTypeController;
//# sourceMappingURL=leave-type.controller.js.map