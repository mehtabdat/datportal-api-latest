import { Job } from 'bull';
import { BulkUploadJobService } from './bulk-upload-job.service';
export declare class PropertyBulkUploadProcessor {
    private readonly bulkUploadJobService;
    private readonly logger;
    constructor(bulkUploadJobService: BulkUploadJobService);
    handleBulkBiometricsUpload(job: Job): Promise<boolean>;
    stopBulkBiometricsUpload(job: Job): Promise<boolean>;
    globalHandler(job: Job): void;
}
