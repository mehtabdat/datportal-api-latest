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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const swagger_1 = require("@nestjs/swagger");
const common_types_1 = require("../../common-types/common-types");
const task_dto_1 = require("./dto/task.dto");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const task_permissions_1 = require("./task.permissions");
const task_filters_dto_1 = require("./dto/task-filters.dto");
const update_task_order_dto_1 = require("./dto/update-task-order.dto");
const task_sorting_dto_1 = require("./dto/task-sorting.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const authorization_service_1 = require("../../authorization/authorization.service");
const upload_files_dto_1 = require("./dto/upload-files.dto");
const file_management_1 = require("../../helpers/file-management");
const update_task_member_dto_1 = require("./dto/update-task-member.dto");
const remove_task_member_dto_1 = require("./dto/remove-task-member.dto");
const constants_1 = require("../../config/constants");
const multerOptionsProtected = (0, file_upload_utils_1.getMulterOptions)({ destination: (0, task_dto_1.getDynamicUploadPath)("organization"), fileTypes: 'images_and_pdf', limit: 10000000 });
const moduleName = "task";
let TaskController = class TaskController {
    constructor(taskService, authorizationService) {
        this.taskService = taskService;
        this.authorizationService = authorizationService;
    }
    async uploadTaskFiles(uploadPropertyFiles, files, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.UPDATE_ANY_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.updateAnyTask) {
                await this.authorizationService.checkIfUserAuthorizedForTask(req.user, uploadPropertyFiles.taskId, hasGlobalPermission.manageTechSupportTask);
            }
            if (files && files.length > 0) {
                let data = await this.taskService.handleTaskFiles(uploadPropertyFiles, files, req.user);
                (0, file_management_1.uploadFile)(files);
                return { message: `Files uploaded successfully`, statusCode: 200, data: data };
            }
            else {
                throw Error("No files to upload");
            }
        }
        catch (err) {
            (0, file_upload_utils_1.removeUploadedFiles)(files);
            throw new common_1.HttpException(err.message, err.statusCode = 400);
        }
    }
    async create(createDto, req) {
        try {
            let data = await this.taskService.create(createDto, req.user);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(filters, sorting, req, pagination) {
        try {
            if (!(filters === null || filters === void 0 ? void 0 : filters.taskType)) {
                filters.taskType = constants_1.TaskType.normal;
            }
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.READ_ALL_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            let appliedFilters = this.taskService.applyFilters(filters, req.user, hasGlobalPermission.readAllTask);
            let dt = await this.taskService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.taskService.countRecords(appliedFilters);
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
    async tehcSupport(filters, sorting, req, pagination) {
        try {
            filters.taskType = constants_1.TaskType.techSupport;
            let appliedFilters = this.taskService.applyFilters(filters, req.user, true);
            let dt = await this.taskService.findAll(appliedFilters, pagination, sorting);
            let tCount = this.taskService.countRecords(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `Tech Support Tasks Fetched Successfully`, statusCode: 200, data: data,
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
    async findOne(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.READ_ALL_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.readAllTask) {
                await this.authorizationService.checkIfUserAuthorizedForTask(req.user, params.id, hasGlobalPermission.manageTechSupportTask);
            }
            let data = await this.taskService.findOne(params.id);
            return { message: `${moduleName}  fetched Successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateTaskOrder(params, updateDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.UPDATE_ANY_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.updateAnyTask) {
                await this.authorizationService.checkIfUserAuthorizedForTask(req.user, params.id, hasGlobalPermission.manageTechSupportTask);
            }
            let data = await this.taskService.updateTaskOrder(params.id, updateDto);
            return { message: `${moduleName} order  updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async update(params, updateDto, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.UPDATE, task_permissions_1.TaskPermissionSet.UPDATE_ANY_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (hasGlobalPermission.updateAnyTask) {
                let data = await this.taskService.update(params.id, updateDto);
                return { message: `${moduleName} updated successfully`, statusCode: 200, data: data };
            }
            else if (hasGlobalPermission.updateTask) {
                let isAuthorized = await this.authorizationService.checkIfUserAuthorizedForTask(req.user, params.id, hasGlobalPermission.manageTechSupportTask);
                if (isAuthorized) {
                    let data = await this.taskService.update(params.id, updateDto);
                    return { message: `${moduleName} updated successfully`, statusCode: 200, data: data };
                }
                else {
                    throw {
                        message: "Forbidden resource",
                        statusCode: 403
                    };
                }
            }
            else {
                throw {
                    message: "Forbidden resource",
                    statusCode: 403
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.DELETE_ANY_TASK, task_permissions_1.TaskPermissionSet.DELETE, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (hasGlobalPermission.deleteAnyTask) {
                let data = await this.taskService.remove(params.id);
                return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
            }
            else if (hasGlobalPermission.deleteTask) {
                let isAuthorized = await this.authorizationService.checkIfUserAuthorizedForTask(req.user, params.id, hasGlobalPermission.manageTechSupportTask);
                if (isAuthorized) {
                    let data = await this.taskService.remove(params.id);
                    return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
                }
                else {
                    throw {
                        message: "Forbidden resource",
                        statusCode: 403
                    };
                }
            }
            else {
                throw {
                    message: "Forbidden resource",
                    statusCode: 403
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeFiles(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.DELETE_FILE, task_permissions_1.TaskPermissionSet.DELETE_OWN_FILE, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.deleteTaskFiles) {
                if (!hasGlobalPermission.deleteTaskOwnFiles) {
                    await this.authorizationService.checkIfUserAuthorizedForTaskFile(req.user, params.id, hasGlobalPermission.manageTechSupportTask);
                }
                else {
                    throw {
                        message: "Forbidden resource",
                        statusCode: 403
                    };
                }
            }
            let data = await this.taskService.removeTaskFile(params.id, req.user);
            return { message: `File deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async updateProjectMembers(updateProjectMember, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.UPDATE_ANY_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.updateAnyTask) {
                await this.authorizationService.checkIfUserAuthorizedForTask(req.user, updateProjectMember.taskId, hasGlobalPermission.manageTechSupportTask);
            }
            let data = await this.taskService.updateTaskMember(updateProjectMember);
            return { message: `Project member has been updated successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async removeProjectMembers(params, req) {
        try {
            let hasGlobalPermission = await this.authorizationService.findUserPermissionsAgainstSlugs(req.user, [task_permissions_1.TaskPermissionSet.UPDATE_ANY_TASK, task_permissions_1.TaskPermissionSet.TECH_SUPPORT]);
            if (!hasGlobalPermission.updateAnyTask) {
                await this.authorizationService.checkIfUserAuthorizedForTask(req.user, params.taskId, hasGlobalPermission.manageTechSupportTask);
            }
            let data = await this.taskService.removeTaskMember(params);
            return { message: `Project member has been removed from the project successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.UPDATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Upload property Files` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the uploaded files on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files[]', 20, multerOptionsProtected)),
    (0, common_1.Post)("uploadTaskFiles"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_files_dto_1.UploadTaskFiles,
        Array, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "uploadTaskFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.CREATE),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "create", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_filters_dto_1.TaskFilters,
        task_sorting_dto_1.TaskSortingDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.TECH_SUPPORT),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)('techSupport'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_filters_dto_1.TaskFilters,
        task_sorting_dto_1.TaskSortingDto, Object, common_types_1.Pagination]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "tehcSupport", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch ${moduleName}  by id` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the ${moduleName} object if found on the system` }),
    (0, common_1.Get)('findOne/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "findOne", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} order `, description: `Only the ${moduleName} white listed fields are considered, other fields are striped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('updateOrder/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_task_order_dto_1.UpdateTaskOrderDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTaskOrder", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Update ${moduleName} `, description: `Only the ${moduleName} white listed fields are considered, other fields are stripped out by default` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the updated ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('update/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto,
        update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.DELETE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)('removeFiles/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_types_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "removeFiles", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false }),
    (0, common_1.Patch)('updateProjectMembers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_task_member_dto_1.UpdateTaskMember, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateProjectMembers", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(task_permissions_1.TaskPermissionSet.UPDATE),
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: task_dto_1.TaskResponseObject, isArray: false }),
    (0, common_1.Delete)('removeProjectMembers/:taskId/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_task_member_dto_1.RemoveTaskMember, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "removeProjectMembers", null);
TaskController = __decorate([
    (0, swagger_1.ApiTags)("task"),
    (0, common_1.Controller)('task'),
    __metadata("design:paramtypes", [task_service_1.TaskService, authorization_service_1.AuthorizationService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map