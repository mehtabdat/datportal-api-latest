import { DailyRoutine } from "@prisma/client";
export declare class Diary implements Partial<DailyRoutine> {
    id: number;
    taskTypeId: number;
    remarks: string | null;
    noOfHours: number;
    projectId: number | null;
    userId: number | null;
    isPublished: boolean;
    isDeleted: boolean;
    addedDate: Date;
    modifiedDate: Date | null;
}
