import { Prisma } from "@prisma/client";
export declare class CreateCompanyAssetDto implements Prisma.CompanyAssetUncheckedCreateInput {
    code?: string;
    type?: number;
    assetName?: string;
    assetDetail?: string;
    quantity?: number;
}
