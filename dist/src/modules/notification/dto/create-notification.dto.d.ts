import { NotificationType, Prisma } from "@prisma/client";
export declare class CreateNotificationDto implements Prisma.NotificationCreateInput {
    slug?: string;
    file?: string;
    message?: string;
    link?: string;
    type?: NotificationType;
    userIds?: number[];
    departmentId?: number;
}
