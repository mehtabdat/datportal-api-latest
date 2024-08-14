import { LeaveRequest as __LeaveRequest } from "@prisma/client";
export declare class LeaveRequest implements Partial<__LeaveRequest> {
    id: number;
    requestById: number;
    typeOfLeave: number;
    purpose: string;
    leaveFrom: Date;
    leaveTo: Date;
    status: number;
    addedDate: Date;
    submittedDate: Date;
}
