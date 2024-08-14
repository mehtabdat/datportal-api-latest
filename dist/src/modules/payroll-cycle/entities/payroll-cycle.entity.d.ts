import { PayrollCycle as __PayrollCycle } from "@prisma/client";
export declare class PayrollCycle implements Partial<__PayrollCycle> {
    id: number;
    fromDate: Date;
    toDate: Date;
    addedDate: Date;
    processed: boolean;
}
