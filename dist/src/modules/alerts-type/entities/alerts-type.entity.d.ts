import { AlertsType as __AlertsType } from "@prisma/client";
export declare class AlertsType implements Partial<__AlertsType> {
    id: number;
    slug: string;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
}
