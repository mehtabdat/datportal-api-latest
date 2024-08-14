import { Attendance } from "@prisma/client";
import { AttendanceEntryType } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class AttendanceFilters implements Partial<Attendance> {
    fromDate?: Date;
    toDate?: Date;
    type?: TypeFromEnumValues<typeof AttendanceEntryType>;
    userId: number;
}
