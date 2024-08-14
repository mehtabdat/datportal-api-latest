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
exports.NotificationEventListener = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_dto_1 = require("../dto/notification.dto");
let NotificationEventListener = class NotificationEventListener {
    constructor(notificationQueue) {
        this.notificationQueue = notificationQueue;
    }
    async sendNotification(event) {
        console.log("Send Notification Event Fired");
        this.notificationQueue.add('sendNotification', {
            message: "Send Notification on the basis of module name",
            data: event
        }, { removeOnComplete: true, delay: 5000 });
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('notification.send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_dto_1.NotificationEventDto]),
    __metadata("design:returntype", Promise)
], NotificationEventListener.prototype, "sendNotification", null);
NotificationEventListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('notification')),
    __metadata("design:paramtypes", [Object])
], NotificationEventListener);
exports.NotificationEventListener = NotificationEventListener;
//# sourceMappingURL=notification-events.listener.js.map