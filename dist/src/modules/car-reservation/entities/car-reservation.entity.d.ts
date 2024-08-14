import { CarReservationRequest as __CarReservation } from "@prisma/client";
export declare class CarReservation implements Partial<__CarReservation> {
    id: number;
    date: Date;
    requestById: number;
    projectId: number;
    companyCarId: number;
    prupose: string;
    status: number;
    addedDate: Date;
}
