import { Prisma } from "@prisma/client";
export declare class AllocateAssetToUserDto implements Prisma.AssetAllocationUncheckedCreateInput {
    userId: number;
    companyAssetId: number;
    quantity: number;
    label?: string;
}
