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
exports.LeaveRequestController = void 0;
const common_1 = require("@nestjs/common");
const leave_request_service_1 = require("./leave-request.service");
const create_leave_request_dto_1 = require("./dto/create-leave-request.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const leave_request_dto_1 = require("./dto/leave-request.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const leave_request_permissions_1 = require("./leave-request.permissions");
const leave_request_filters_dto_1 = require("./dto/leave-request-filters.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const leave_request_admin_action_dto_1 = require("./dto/leave-request-admin-action.dto");
const leave_request_authorization_service_1 = require("./leave-request.authorization.service");
const get_leave_request_info_dto_1 = require("./dto/get-leave-request-info.dto");
const user_permissions_1 = require("../user/user.permissions");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, leave_request_dto_1.getDynamicUploadPath)(), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "leave-request";
let LeaveRequestController = class LeaveRequestController {
    constructor(leaveRequestService, leaveRequestAuthorizationService) {
        this.leaveRequestService = leaveRequestService;
        this.leaveRequestAuthorizationService = leaveRequestAuthorizationService;
    }
    async create(createDto, files, req) {
        try {
            let data = await this.leaveRequestService.create(createDto, req.user);
            await this.leaveRequestService.handleFiles(data.id, files);
            (0, file_management_1.uploadFile)(files);
            let recordData = await this.leaveRequestService.findOne(data.id);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: recordData };
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, req, pagination) {
        try {
            let permissions = await this.leaveRequestAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [leave_request_permissions_1.LeaveRequestPermissionSet.HR_APPROVAL]);
            let appliedFilters = this.leaveRequestService.applyFilters(filters, req.user, permissions);
            let dt = await this.leaveRequestService.findAll(appliedFilters, pagination);
            let tCount = this.leaveRequestService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async readOwnRequest(filters, req, pagination) {
        try {
            filters.userId = req.user.userId;
            let appliedFilters = this.leaveRequestService.applyFilters(filters, req.user);
            let dt = await this.leaveRequestService.findAll(appliedFilters, pagination);
            let tCount = this.leaveRequestService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `${moduleName} fetched Successfully`, statusCode: 200, data: data,
                meta: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    total: totalCount,
                    pageCount: pageCount
                }
            };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async getLeaveInfo(params, req) {
        try {
            let data = await this.leaveRequestService.getLeaveInfo(params, req.user);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, (err.statusCode) ? err.statusCode : 404);
        }
    }
    async findOne(params, req) {
        try {
            let permissions = await this.leaveRequestAuthorizationService.findUserPermissionsAgainstSlugs(req.user, [leave_request_permissions_1.LeaveRequestPermissionSet.HR_APPROVAL, user_permissions_1.UserPermissionSet.MANAGE_ALL]);
            if (!(permissions.leaveRequestHRApproval || permissions.manageAllUser)) {
                await this.leaveRequestAuthorizationService.isAuthorizedForLeaveRequestToRead(params.id, req.user);
            }
            let data = await this.leaveRequestService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findLeavesReport(req) {
        try {
            let data = await this.leaveRequestService.findLeavesReport(req.user.userId);
            return { message: `Leaves report fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findLeavesReportOfUser(params, req) {
        try {
            let data = await this.leaveRequestService.findLeavesReport(params.id);
            return { message: `Leaves report fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async withdraw(params, req) {
        try {
            await this.leaveRequestAuthorizationService.isAuthorizedForLeaveRequest(params.id, req.user);
            let data = await this.leaveRequestService.withdraw(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async submitRequest(params, req) {
        try {
            await this.leaveRequestAuthorizationService.isAuthorizedForLeaveRequest(params.id, req.user);
            let data = await this.leaveRequestService.submitRequest(params.id);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async hrAction(params, LeaveRequestAdminAction, req) {
        try {
            let data = await this.leaveRequestService.hrUpdate(params.id, LeaveRequestAdminAction, req.user);
            return { message: `Your action has been saved successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async projectManagerAction(params, action, req) {
        try {
            await this.leaveRequestAuthorizationService.isUserProjectManager(params.id, req.user);
            let data = await this.leaveRequestService.projectManagerAction(params.id, action, req.user);
            return { message: `Your request has been withdrawn successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files[]", 10, multerOptionsProtected)),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_request_dto_1.CreateLeaveRequestDto,
        Array, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_request_filters_dto_1.LeaveRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('own'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_request_filters_dto_1.LeaveRequestFiltersDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "readOwnRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('getLeaveInfo/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_leave_request_info_dto_1.LeaveRequestInfoDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "getLeaveInfo", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findLeavesReport'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "findLeavesReport", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(user_permissions_1.UserPermissionSet.MANAGE_ALL),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findLeavesReportOfUser/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "findLeavesReportOfUser", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('withdraw/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "withdraw", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Withdraw cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('submitRequest/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "submitRequest", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(leave_request_permissions_1.LeaveRequestPermissionSet.HR_APPROVAL),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `HR Action on cash advance request` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('hrAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        leave_request_admin_action_dto_1.LeaveRequestAdminAction, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "hrAction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Action from finance department` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: leave_request_dto_1.LeaveRequestResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('projectManagerAction/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        leave_request_admin_action_dto_1.LeaveRequestAdminAction, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "projectManagerAction", null);
LeaveRequestController = __decorate([
    (0, swagger_1.ApiTags)("leave-request"),
    (0, common_1.Controller)('leave-request'),
    __metadata("design:paramtypes", [leave_request_service_1.LeaveRequestService, leave_request_authorization_service_1.LeaveRequestAuthorizationService])
], LeaveRequestController);
exports.LeaveRequestController = LeaveRequestController;
//# sourceMappingURL=leave-request.controller.js.map