import { Prisma, ThresholdType } from "@prisma/client";
export declare class CreateLeaveTypeDto implements Prisma.LeaveTypeUncheckedCreateInput {
    title: string;
    slug: string;
    isPaid: boolean;
    isPublished: boolean;
    threshold: number;
    thresholdType: ThresholdType;
}
