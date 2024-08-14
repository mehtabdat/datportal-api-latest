export declare enum DashboardDateRange {
    "7_days" = 0,
    "30_days" = 1,
    "60_days" = 2,
    "90_days" = 3,
    "180_days" = 4,
    "365_days" = 5
}
export declare class DashboardFiltersDto {
    range: keyof typeof DashboardDateRange;
}
