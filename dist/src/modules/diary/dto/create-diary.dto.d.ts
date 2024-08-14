import { Prisma } from "@prisma/client";
export declare class CreateDiaryDto implements Prisma.DailyRoutineUncheckedCreateInput {
    taskTypeId: number;
    remarks?: string;
    noOfHours?: number;
    projectId?: number;
    userId?: number;
}
