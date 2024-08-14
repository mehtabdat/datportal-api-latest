import { Prisma } from "@prisma/client";
export declare class CreateTaxRateDto implements Prisma.TaxRateUncheckedCreateInput {
    taxType: string;
    title: string;
    rate?: number;
}
