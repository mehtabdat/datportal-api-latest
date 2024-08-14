import { Queue } from 'bull';
export declare class AttendanceCronJob {
    private attendanceQueue;
    private readonly logger;
    constructor(attendanceQueue: Queue);
    prepareAttendanceReport(): Promise<void>;
}
