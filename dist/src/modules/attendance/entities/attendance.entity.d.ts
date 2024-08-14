import { User, Attendance as __Attendance } from "@prisma/client";
import { AttendanceEntryType, AttendanceStatus } from "src/config/constants";
export declare class Attendance implements Partial<__Attendance> {
    id: number;
    userId: number;
    type: number;
    checkIn: Date;
    checkOut: Date;
    totalHours: number;
    note: string;
    addedById: number;
    addedDate: Date;
}
export type UserAttendanceType = {
    recordId: number | null;
    userId: number;
    entryType?: AttendanceEntryType;
    day: Date;
    status: AttendanceStatus;
    note: string;
    checkIn?: Date;
    checkOut?: Date;
    hoursWorked: number;
    proRatedDeduction: number;
    AddedBy: Partial<User> | null;
    ModifiedBy: Partial<User> | null;
    modifiedDate?: Date;
    totalHours: number;
};
