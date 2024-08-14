export declare class ReceiptAction {
    receiptId: number;
    approvedAmount: number;
    comment: string;
    status: 2 | 3 | 4;
}
export declare class ReimbursementHrAction {
    comment?: string;
    reimbursementReceipts: Array<ReceiptAction>;
}
