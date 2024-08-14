import { ThresholdType, LeaveType as __LeaveType } from "@prisma/client";
export declare class LeaveType implements Partial<__LeaveType> {
    id: number;
    title: string;
    slug: string;
    isPaid: boolean;
    threshold: number;
    frequency: ThresholdType;
    addedDate: Date;
    isDeleted: boolean;
    isPublished: boolean;
}
