import { ReimbursementStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class ReimbursementFiltersDto {
    userId: number;
    fetchOpenRequest: boolean;
    status: TypeFromEnumValues<typeof ReimbursementStatus>;
    fromDate?: string;
    toDate?: string;
}
