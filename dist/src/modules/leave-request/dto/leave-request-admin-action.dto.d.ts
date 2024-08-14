import { LeaveRequestStatus } from "src/config/constants";
export declare class LeaveRequestAdminAction {
    isPaid: boolean;
    comment?: string;
    status: LeaveRequestStatus.approved | LeaveRequestStatus.rejected | LeaveRequestStatus.request_modification;
}
