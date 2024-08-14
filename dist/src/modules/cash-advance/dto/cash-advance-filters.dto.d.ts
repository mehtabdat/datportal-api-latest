import { CashAdvanceRequestStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class CashAdvanceRequestFiltersDto {
    userId: number;
    fetchOpenRequest: boolean;
    status: TypeFromEnumValues<typeof CashAdvanceRequestStatus>;
    fromDate?: string;
    toDate?: string;
}
