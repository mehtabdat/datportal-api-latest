import { Prisma, WorkingHours } from "@prisma/client";
export declare class WorkingHour implements WorkingHours {
    id: number;
    title: string;
    hours: Prisma.JsonValue;
    addedDate: Date;
}
