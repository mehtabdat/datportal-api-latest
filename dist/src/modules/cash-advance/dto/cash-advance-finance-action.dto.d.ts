import { CashAdvanceRequestStatus } from "src/config/constants";
type AcceptedStatusType = CashAdvanceRequestStatus.rejected | CashAdvanceRequestStatus.paid_and_closed;
export declare class CashAdvanceFinanceAction {
    comment?: string;
    numberOfInstallments: number;
    status: AcceptedStatusType;
}
export {};
