import { Prisma } from "@prisma/client";
export declare class CreateLeaveRequestDto implements Prisma.LeaveRequestUncheckedCreateInput {
    leaveTypeId: number;
    purpose?: string;
    leaveFrom?: string;
    leaveTo?: string;
    files?: string;
    isPaid?: boolean;
}
