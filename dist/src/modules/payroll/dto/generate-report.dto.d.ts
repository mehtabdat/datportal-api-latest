export declare enum PayrollReportType {
    "all" = "all",
    "users" = "users",
    "department" = "department",
    "organization" = "organization"
}
export declare class GeneratePayrollReport {
    payrollCycleId?: number;
    reportType: PayrollReportType;
    userIds?: number[];
    departmentId?: number;
    organizationId?: number;
}
