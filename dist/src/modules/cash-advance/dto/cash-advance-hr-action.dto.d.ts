import { CashAdvanceRequestStatus } from "src/config/constants";
type AcceptedStatusType = CashAdvanceRequestStatus.approved | CashAdvanceRequestStatus.rejected | CashAdvanceRequestStatus.partially_approved;
export declare class CashAdvanceHrAction {
    comment?: string;
    status: AcceptedStatusType;
    approvedAmount?: number;
}
export {};
