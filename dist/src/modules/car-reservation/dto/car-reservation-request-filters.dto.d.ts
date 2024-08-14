import { CarReservationRequestStatus } from "src/config/constants";
import { TypeFromEnumValues } from "src/helpers/common";
export declare class CarReservationRequestFiltersDto {
    userId: number;
    fetchOpenRequest: boolean;
    status: TypeFromEnumValues<typeof CarReservationRequestStatus>;
    fromDate?: string;
    toDate?: string;
}
