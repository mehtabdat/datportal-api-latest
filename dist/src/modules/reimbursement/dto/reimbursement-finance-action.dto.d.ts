import { ReimbursementStatus } from "src/config/constants";
type AcceptedStatus = ReimbursementStatus.rejected | ReimbursementStatus.paid_and_closed;
declare const AcceptedStatus: ReimbursementStatus[];
export declare class ReimbursementFinanceAction {
    comment?: string;
    status: AcceptedStatus;
}
export {};
