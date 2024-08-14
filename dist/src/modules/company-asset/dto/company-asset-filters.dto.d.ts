import { CompanyAsset } from "@prisma/client";
export declare class CompanyAssetFiltersDto implements Partial<CompanyAsset> {
    code: string;
    assetName: string;
    type: number;
}
