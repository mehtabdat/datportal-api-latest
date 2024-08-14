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
exports.NotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const notification_processor_service_1 = require("./notification.processor.service");
let NotificationProcessor = class NotificationProcessor {
    constructor(notificationProcessorService) {
        this.notificationProcessorService = notificationProcessorService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async sendNotification(job) {
        var _a;
        this.logger.log("Request to send Notification received");
        let eventData = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data;
        if (!eventData || !eventData.moduleName || !eventData.recordId)
            return false;
        try {
            if (this.notificationProcessorService.isProcessing === false) {
                this.logger.log("Starting Notification Job");
                this.notificationProcessorService.isProcessing = true;
                this.notificationProcessorService.activeJob = eventData;
                await this.notificationProcessorService.sendNotification(eventData);
            }
            else {
                this.notificationProcessorService.jobQueue.push(eventData);
                this.logger.log("Notification added on queue", this.notificationProcessorService.jobQueue);
            }
        }
        catch (err) {
            this.logger.error("Send Notification Error", err.message);
        }
    }
    globalHandler(job) {
        this.logger.error('No listners were provided, fall back to default', job.data);
    }
};
__decorate([
    (0, bull_1.Process)('sendNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "sendNotification", null);
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationProcessor.prototype, "globalHandler", null);
NotificationProcessor = __decorate([
    (0, bull_1.Processor)('notification'),
    __metadata("design:paramtypes", [notification_processor_service_1.NotificationProcessorService])
], NotificationProcessor);
exports.NotificationProcessor = NotificationProcessor;
//# sourceMappingURL=notification.processor.js.map