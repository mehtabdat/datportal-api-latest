import { ResponseSuccess } from "src/common-types/common-types";
import { CarReservation } from "../entities/car-reservation.entity";
export declare class CarReservationResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CarReservation;
}
export declare class CarReservationResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CarReservation;
}
export declare function getDynamicUploadPath(): string;
