import { Prisma } from "@prisma/client";
export declare class CreateProductDto implements Prisma.ProductUncheckedCreateInput {
    productCode: string;
    title: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    accountId?: number;
    taxRateId?: number;
}
