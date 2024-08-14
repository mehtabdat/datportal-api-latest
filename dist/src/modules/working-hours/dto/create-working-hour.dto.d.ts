import { Prisma } from "@prisma/client";
export declare class OpeningHours {
    day: number;
    name: string;
    open: string;
    close: string;
    closed: boolean;
    totalHours: number;
}
export declare class CreateWorkingHourDto implements Prisma.WorkingHoursCreateInput {
    title: string;
    openingHours: OpeningHours[];
}
