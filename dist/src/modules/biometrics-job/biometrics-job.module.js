"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricsJobModule = void 0;
const common_1 = require("@nestjs/common");
const biometrics_job_service_1 = require("./biometrics-job.service");
const biometrics_job_controller_1 = require("./biometrics-job.controller");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../config/constants");
const biometrics_job_processor_1 = require("./processor/biometrics-job.processor");
const bulk_upload_job_service_1 = require("./processor/bulk-upload-job.service");
const file_convertor_service_1 = require("../file-convertor/file-convertor.service");
let BiometricsJobModule = class BiometricsJobModule {
};
BiometricsJobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.registerQueue({
                name: 'bulk-upload-biometrics',
                configKey: constants_1.REDIS_DB_NAME,
            }),
            bull_1.BullModule.registerQueue({
                name: 'attendance',
                configKey: constants_1.REDIS_DB_NAME,
            }),
        ],
        controllers: [biometrics_job_controller_1.BiometricsJobController],
        providers: [biometrics_job_service_1.BiometricsJobService, biometrics_job_processor_1.PropertyBulkUploadProcessor, bulk_upload_job_service_1.BulkUploadJobService, file_convertor_service_1.FileConvertorService]
    })
], BiometricsJobModule);
exports.BiometricsJobModule = BiometricsJobModule;
//# sourceMappingURL=biometrics-job.module.js.map