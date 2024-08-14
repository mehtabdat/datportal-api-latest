import { CompanyAsset as __CompanyAsset } from "@prisma/client";
export declare class CompanyAsset implements Partial<__CompanyAsset> {
    id: number;
    code: string;
    type: number;
    assetName: string;
    assetDetail: string;
    quantity: number;
    addedDate: Date;
}
