import { TaxRate as TaxRateModel } from "@prisma/client";
export declare class TaxRate implements Partial<TaxRateModel> {
    id: number;
    taxType: string;
    title: string;
    accountType: number;
    rate: number;
}
