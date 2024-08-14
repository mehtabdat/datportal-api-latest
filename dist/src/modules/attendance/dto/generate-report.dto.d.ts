export declare enum AttendanceReportType {
    "all" = "all",
    "users" = "users",
    "department" = "department",
    "organization" = "organization"
}
export declare class GenerateAttendanceReport {
    fromDate: Date;
    toDate: Date;
    reportType: AttendanceReportType;
    userIds?: number[];
    departmentId?: number;
    organizationId?: number;
}
