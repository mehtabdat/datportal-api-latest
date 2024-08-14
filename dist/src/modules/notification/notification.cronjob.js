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
var NotificationCronJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCronJob = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const notification_dto_1 = require("./dto/notification.dto");
let NotificationCronJob = NotificationCronJob_1 = class NotificationCronJob {
    constructor(notificationQueue) {
        this.notificationQueue = notificationQueue;
        this.logger = new common_1.Logger(NotificationCronJob_1.name);
    }
    async senddailyNotification() {
        this.logger.debug("Called every day at 07:00AM to find user attendance");
        this.logger.log("Subscribing for notification");
        let notificationData = new notification_dto_1.NotificationEventDto({ recordId: 1, moduleName: 'dailyNotification' });
        this.notificationQueue.add('sendNotification', {
            message: "Send Notification on the basis of module name",
            data: notificationData
        }, { removeOnComplete: true, delay: 5000 });
    }
};
__decorate([
    (0, schedule_1.Cron)('0 7 */3 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationCronJob.prototype, "senddailyNotification", null);
NotificationCronJob = NotificationCronJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('notification')),
    __metadata("design:paramtypes", [Object])
], NotificationCronJob);
exports.NotificationCronJob = NotificationCronJob;
//# sourceMappingURL=notification.cronjob.js.map