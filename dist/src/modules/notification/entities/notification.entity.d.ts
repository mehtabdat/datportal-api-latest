import { Notification as __Notification, NotificationType } from "@prisma/client";
export declare class Notification implements Partial<__Notification> {
    id: number;
    slug: string | null;
    icon: string | null;
    message: string | null;
    link: string | null;
    addedDate: Date;
    modifiedDate: Date | null;
    type: NotificationType;
    isActive: boolean;
}
