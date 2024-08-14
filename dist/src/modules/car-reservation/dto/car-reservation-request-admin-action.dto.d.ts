import { CarReservationRequestStatus } from "src/config/constants";
export declare class CarReservationRequestAdminAction {
    companyCarId?: number;
    comment?: string;
    status: CarReservationRequestStatus.approved | CarReservationRequestStatus.rejected;
}
