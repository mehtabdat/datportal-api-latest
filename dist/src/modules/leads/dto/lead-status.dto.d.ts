import { LeadsStatus } from "src/config/constants";
type AllowedStatusType = LeadsStatus.canceled | LeadsStatus.invalid_request | LeadsStatus.spam | LeadsStatus.unqualified;
export declare class LeadsStatusDto {
    status: AllowedStatusType;
}
export {};
