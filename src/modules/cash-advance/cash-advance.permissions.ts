export enum CashAdvancePermissionSet {
    "CREATE" = "createCashAdvance",
    "UPDATE" = "updateCashAdvance",
    "DELETE" = "deleteCashAdvance",
    "READ" = "readCashAdvance",
    "HR_APPROVAL" = "cashAdvanceHRApproval",
    "FINANCE_APPROVAL" = "cashAdvanceFinanceApproval"
}

export type CashAdvancePermissionSetType = {
    [key in CashAdvancePermissionSet]: boolean;
}