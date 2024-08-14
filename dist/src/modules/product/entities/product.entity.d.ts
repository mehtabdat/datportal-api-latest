import { Product as ProductModel } from "@prisma/client";
export declare class Product implements ProductModel {
    id: number;
    xeroReference: string;
    productCode: string;
    title: string;
    description: string;
    quantity: number;
    unitPrice: number;
    accountId: number;
    taxRateId: number;
}
