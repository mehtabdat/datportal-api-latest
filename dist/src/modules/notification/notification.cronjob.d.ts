import { Queue } from 'bull';
export declare class NotificationCronJob {
    private notificationQueue;
    private readonly logger;
    constructor(notificationQueue: Queue);
    senddailyNotification(): Promise<void>;
}
