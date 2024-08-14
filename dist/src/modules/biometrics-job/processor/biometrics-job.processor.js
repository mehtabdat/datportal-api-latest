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
exports.PropertyBulkUploadProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const bulk_upload_job_service_1 = require("./bulk-upload-job.service");
let PropertyBulkUploadProcessor = class PropertyBulkUploadProcessor {
    constructor(bulkUploadJobService) {
        this.bulkUploadJobService = bulkUploadJobService;
        this.logger = new common_1.Logger(this.constructor.name);
    }
    async handleBulkBiometricsUpload(job) {
        var _a, _b;
        let jobId = (_b = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.jobId;
        if (!jobId)
            return false;
        try {
            this.logger.log("Starting new biometrics upload job", jobId);
            if (this.bulkUploadJobService.isProcessing === false) {
                this.bulkUploadJobService.resetData();
                this.bulkUploadJobService.isProcessing = true;
                this.bulkUploadJobService.activeJob = jobId;
                await this.bulkUploadJobService.bulkUploadProperty(jobId);
            }
            else {
                this.bulkUploadJobService.jobQueue.push(jobId);
                console.log(this.bulkUploadJobService.jobQueue);
            }
        }
        catch (err) {
            console.log("Bulk Property Process Error", err.message);
            this.bulkUploadJobService.reportError(jobId, err.message);
        }
    }
    async stopBulkBiometricsUpload(job) {
        var _a, _b;
        let jobId = (_b = (_a = job.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.jobId;
        if (!jobId)
            return false;
        try {
            await this.bulkUploadJobService.clearJob(jobId);
        }
        catch (err) {
            this.bulkUploadJobService.reportError(jobId, err.message);
            console.log("Stop Property Process Error", err.message);
        }
    }
    globalHandler(job) {
        this.logger.error('No listners were provided, fall back to default', job.data);
    }
};
__decorate([
    (0, bull_1.Process)('bulkUploadBiometrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyBulkUploadProcessor.prototype, "handleBulkBiometricsUpload", null);
__decorate([
    (0, bull_1.Process)('stopBulkUploadBiometrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertyBulkUploadProcessor.prototype, "stopBulkBiometricsUpload", null);
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PropertyBulkUploadProcessor.prototype, "globalHandler", null);
PropertyBulkUploadProcessor = __decorate([
    (0, bull_1.Processor)('bulk-upload-biometrics'),
    __metadata("design:paramtypes", [bulk_upload_job_service_1.BulkUploadJobService])
], PropertyBulkUploadProcessor);
exports.PropertyBulkUploadProcessor = PropertyBulkUploadProcessor;
//# sourceMappingURL=biometrics-job.processor.js.map