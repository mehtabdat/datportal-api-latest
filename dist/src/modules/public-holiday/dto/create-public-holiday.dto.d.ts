import { Prisma } from "@prisma/client";
export declare class CreatePublicHolidayDto implements Partial<Prisma.PublicHolidayUncheckedCreateInput> {
    title?: string;
    dates?: string[];
}
