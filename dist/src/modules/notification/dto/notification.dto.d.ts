import { ResponseSuccess } from "src/common-types/common-types";
import { Notification } from "../entities/notification.entity";
export declare class NotificationResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Notification;
}
export declare class NotificationResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: Notification;
}
export declare enum NotificationType {
    quotationApproved = "quotationApproved",
    milestoneCompleted = "milestoneCompleted",
    enquiryConfirmed = "enquiryConfirmed",
    reimbursement = "reimbursement",
    invoice = "invoice",
    projectMembersAddition = "projectMembersAddition",
    projectHoldNotification = "projectHoldNotification",
    projectResumeNotification = "projectResumeNotification",
    newProject = "newProject",
    dailyNotification = "dailyNotification"
}
export declare class NotificationEventDto {
    recordId: number;
    moduleName: keyof typeof NotificationType;
    additionalData?: any;
    constructor(data: {
        recordId: number;
        moduleName: keyof typeof NotificationType;
        additionalData?: any;
    });
}
export declare const notificationFileUploadPath = "public/notification";
