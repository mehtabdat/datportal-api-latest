import { ResponseSuccess } from "src/common-types/common-types";
import { PayrollCycle } from "../entities/payroll-cycle.entity";
export declare class PayrollCycleResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PayrollCycle;
}
export declare class PayrollCycleResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: PayrollCycle;
}
