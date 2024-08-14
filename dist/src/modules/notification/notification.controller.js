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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const swagger_1 = require("@nestjs/swagger");
const params_dto_1 = require("./dto/params.dto");
const notification_dto_1 = require("./dto/notification.dto");
const file_upload_utils_1 = require("../../helpers/file-upload.utils");
const platform_express_1 = require("@nestjs/platform-express");
const file_management_1 = require("../../helpers/file-management");
const notification_filters_dto_1 = require("./dto/notification-filters.dto");
const notification_pagination_dto_1 = require("./dto/notification-pagination.dto");
const notification_permissions_1 = require("./notification.permissions");
const authorization_decorator_1 = require("../../authorization/authorization-decorator");
const multerOptions = (0, file_upload_utils_1.getMulterOptions)({ destination: notification_dto_1.notificationFileUploadPath, fileTypes: 'images_only_with_svg' });
const moduleName = "notification";
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async create(createNotificationDto, file) {
        try {
            if (file) {
                createNotificationDto.file = (0, file_upload_utils_1.extractRelativePathFromFullPath)(file.path);
            }
            let data = await this.notificationService.create(createNotificationDto);
            (0, file_management_1.uploadFile)(file);
            return { message: `${moduleName} created successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async findAll(req, filters, pagination) {
        try {
            let appliedFilters = this.notificationService.applyFilters(filters, req.user);
            let dt = await this.notificationService.findAll(appliedFilters, pagination);
            let tCount = this.notificationService.countNotifications(appliedFilters);
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
    async findAllAnnouncements(req, filters, pagination) {
        try {
            let appliedFilters = this.notificationService.applyAnnouncementFilters();
            let dt = await this.notificationService.findAllAnnouncement(appliedFilters, pagination);
            let tCount = this.notificationService.countNotifications(appliedFilters);
            const [data, totalCount] = await Promise.all([dt, tCount]);
            let pageCount = Math.floor(totalCount / pagination.perPage) + ((totalCount % pagination.perPage) === 0 ? 0 : 1);
            return { message: `Announcements fetched Successfully`, statusCode: 200, data: data,
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
    async markAsReadAll(req) {
        try {
            let data = await this.notificationService.readAllNotification(req.user);
            return { message: `${moduleName} read successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async markAsRead(params, req) {
        try {
            let data = await this.notificationService.readNotification(params.id, req.user);
            return { message: `${moduleName} read successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
    async remove(params) {
        try {
            let data = await this.notificationService.remove(params.id);
            return { message: `${moduleName} deleted successfully`, statusCode: 200, data: data };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, err.statusCode);
        }
    }
};
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(notification_permissions_1.NotificationPermissionSet.CREATE),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: `Add a new ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseObject, isArray: false, description: `Returns the new ${moduleName} record on success` }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multerOptions)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Fetch all ${moduleName} in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseArray, isArray: false, description: `Return a list of ${moduleName} available` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notification_filters_dto_1.NotificationFilters,
        notification_pagination_dto_1.NotificationPaginationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, authorization_decorator_1.CheckPermissions)(notification_permissions_1.NotificationPermissionSet.READ),
    (0, swagger_1.ApiOperation)({ summary: `Fetch all announcement in the system` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseArray, isArray: false, description: `Return a list of announcement available` }),
    (0, common_1.Get)('announcement'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notification_filters_dto_1.NotificationFilters,
        notification_pagination_dto_1.NotificationPaginationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "findAllAnnouncements", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Mark as Read ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseObject, isArray: false, description: `Returns the read ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('read/all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsReadAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Mark as Read ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseObject, isArray: false, description: `Returns the read ${moduleName} object if found on the system` }),
    (0, common_1.Patch)('read/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Delete ${moduleName}` }),
    (0, swagger_1.ApiResponse)({ status: 200, type: notification_dto_1.NotificationResponseObject, isArray: false, description: `Returns the deleted ${moduleName} object if found on the system` }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [params_dto_1.ParamsDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "remove", null);
NotificationController = __decorate([
    (0, swagger_1.ApiTags)("notification"),
    (0, common_1.Controller)('notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map