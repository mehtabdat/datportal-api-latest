import { Job } from 'bull';
import { NotificationProcessorService } from './notification.processor.service';
import { NotificationEventDto } from '../dto/notification.dto';
export declare class NotificationProcessor {
    private readonly notificationProcessorService;
    private readonly logger;
    constructor(notificationProcessorService: NotificationProcessorService);
    sendNotification(job: Job<{
        data: NotificationEventDto;
    }>): Promise<boolean>;
    globalHandler(job: Job): void;
}
