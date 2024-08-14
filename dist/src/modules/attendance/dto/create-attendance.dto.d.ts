import { Prisma } from "@prisma/client";
export declare class CreateAttendanceDto implements Prisma.AttendanceUncheckedCreateInput {
    checkIn?: Date;
    checkOut?: Date;
    userId?: number;
    note?: string;
}
