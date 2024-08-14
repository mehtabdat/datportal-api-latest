import { Attendance } from "@prisma/client";
import { AttendanceEntryType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class UserAttendanceFilters implements Partial<Attendance> {
    year?: number;
    month?: number;
    type: TypeFromEnumValues<typeof AttendanceEntryType>;
    userId: number;
}
