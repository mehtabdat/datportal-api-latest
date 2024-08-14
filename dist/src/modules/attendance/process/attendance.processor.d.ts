import { Job } from 'bull';
import { AttendanceProcessorService } from './attendance.processor.service';
export declare class AttendanceProcessor {
    private readonly attendanceProcessorService;
    private readonly logger;
    constructor(attendanceProcessorService: AttendanceProcessorService);
    prepareAttendanceReport(job: Job): Promise<void>;
    prepareBulkAttendanceReport(job: Job): Promise<void>;
    globalHandler(job: Job): void;
}
