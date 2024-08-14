import { Prisma } from "@prisma/client";
export declare class CreateCarReservationRequestDto implements Prisma.CarReservationRequestUncheckedCreateInput {
    fromDate?: string | Date;
    toDate?: string | Date;
    purpose?: string;
    projectId?: number;
    files?: any;
}
