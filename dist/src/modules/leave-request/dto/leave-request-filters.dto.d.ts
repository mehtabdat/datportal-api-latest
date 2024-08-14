import { LeaveRequestStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class LeaveRequestFiltersDto {
    userId: number;
    fetchOpenRequest: boolean;
    status: TypeFromEnumValues<typeof LeaveRequestStatus>;
    fromDate?: string;
    toDate?: string;
}
