"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const notification_controller_1 = require("./notification.controller");
const notification_events_listener_1 = require("./listeners/notification-events.listener");
const notification_processor_service_1 = require("./processor/notification.processor.service");
const notification_processor_1 = require("./processor/notification.processor");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const mail_service_1 = require("../../mail/mail.service");
const notification_cronjob_1 = require("./notification.cronjob");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'notification',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService, notification_events_listener_1.NotificationEventListener, notification_processor_service_1.NotificationProcessorService, notification_processor_1.NotificationProcessor, mail_service_1.MailService, notification_cronjob_1.NotificationCronJob]
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map