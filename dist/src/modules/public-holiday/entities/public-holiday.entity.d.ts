import { PublicHoliday as __PublicHoliday } from "@prisma/client";
export declare class PublicHoliday implements Partial<__PublicHoliday> {
    id: number;
    title: string;
    date: Date;
    addedById: number;
    addedDate: Date;
}
