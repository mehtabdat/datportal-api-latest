import { Queue } from 'bull';
import { NotificationEventDto } from '../dto/notification.dto';
export declare class NotificationEventListener {
    private notificationQueue;
    constructor(notificationQueue: Queue);
    sendNotification(event: NotificationEventDto): Promise<void>;
}
