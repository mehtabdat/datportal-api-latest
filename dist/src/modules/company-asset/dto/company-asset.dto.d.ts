import { ResponseSuccess } from "src/common-types/common-types";
import { CompanyAsset } from "../entities/company-asset.entity";
export declare class CompanyAssetsResponseObject implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CompanyAsset;
}
export declare class CompanyAssetsResponseArray implements ResponseSuccess {
    message: string;
    statusCode: number;
    data: CompanyAsset;
}
