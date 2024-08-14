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
exports.notificationFileUploadPath = exports.NotificationEventDto = exports.NotificationType = exports.NotificationResponseArray = exports.NotificationResponseObject = void 0;
const swagger_1 = require("@nestjs/swagger");
const notification_entity_1 = require("../entities/notification.entity");
class NotificationResponseObject {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseObject.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationResponseObject.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", notification_entity_1.Notification)
], NotificationResponseObject.prototype, "data", void 0);
exports.NotificationResponseObject = NotificationResponseObject;
class NotificationResponseArray {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseArray.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NotificationResponseArray.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", notification_entity_1.Notification)
], NotificationResponseArray.prototype, "data", void 0);
exports.NotificationResponseArray = NotificationResponseArray;
var NotificationType;
(function (NotificationType) {
    NotificationType["quotationApproved"] = "quotationApproved";
    NotificationType["milestoneCompleted"] = "milestoneCompleted";
    NotificationType["enquiryConfirmed"] = "enquiryConfirmed";
    NotificationType["reimbursement"] = "reimbursement";
    NotificationType["invoice"] = "invoice";
    NotificationType["projectMembersAddition"] = "projectMembersAddition";
    NotificationType["projectHoldNotification"] = "projectHoldNotification";
    NotificationType["projectResumeNotification"] = "projectResumeNotification";
    NotificationType["newProject"] = "newProject";
    NotificationType["dailyNotification"] = "dailyNotification";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
class NotificationEventDto {
    constructor(data) {
        this.moduleName = data.moduleName;
        this.recordId = data.recordId;
        this.additionalData = data.additionalData;
    }
}
exports.NotificationEventDto = NotificationEventDto;
exports.notificationFileUploadPath = 'public/notification';
//# sourceMappingURL=notification.dto.js.map